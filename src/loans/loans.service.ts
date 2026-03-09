import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Loan } from './entities/loan.entity';
import { DataSource, IsNull, Repository } from 'typeorm';
import { Duration } from '../common/utils/duration';
import { Copy } from '../copies/entities/copy.entity';
import { Reader } from '../readers/entities/reader.entity';
import { Paginated, Pagination } from '../common/pagination/pagination';
import { ReturnCopyDto } from './dto/return-copy.dto';
import { BorrowCopyDto } from './dto/borrow-copy.dto';
import { LoanQueryDto } from './dto/loan-query.dto';
import { LoanResponseDto } from './dto/loan-response.dto';

@Injectable()
export class LoansService {
  private static readonly LOAN_DURATION = Duration.fromDays(14);
  private static readonly TOLERANCE_PERIOD = Duration.fromDays(7);
  private static readonly READER_MAX_LOANS = 5;
  constructor(
    private readonly datasource: DataSource,
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
  ) {}
  async findAll({
    page,
    pageSize,
  }: LoanQueryDto): Promise<Paginated<LoanResponseDto>> {
    const offset = Pagination.calculateOffset(page, pageSize);
    const [loans, total] = await this.loanRepository.findAndCount({
      where: {
        deletedAt: IsNull(),
      },
      relations: ['copy', 'reader'],
      skip: offset,
      take: pageSize,
    });
    return Pagination.create({
      data: loans.map((loan) => LoanResponseDto.fromEntity(loan)),
      page: 1,
      pageSize: total,
      totalItems: total,
    });
  }

  async findOne(id: number): Promise<LoanResponseDto | null> {
    const loan = await this.loanRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
      relations: ['copy', 'reader'],
    });
    if (!loan) {
      return null;
    }
    return LoanResponseDto.fromEntity(loan);
  }

  async borrow({
    copyId,
    readerId,
    loanedAt,
  }: BorrowCopyDto): Promise<LoanResponseDto> {
    /**
     * This could lead to some race conditions if two users try to borrow the same copy at the same time,
     * but due to the business rules of the library, where the reader has to be present to borrow a copy,
     * it's unlikely to happen.
     */
    const loan = await this.datasource.transaction(async (manager) => {
      const loanRepository = manager.getRepository(Loan);
      const copyRepository = manager.getRepository(Copy);
      const readerRepository = manager.getRepository(Reader);
      const now = new Date();
      const [copy, reader] = await Promise.all([
        copyRepository.findOne({
          where: {
            id: copyId,
            deletedAt: IsNull(),
          },
        }),
        readerRepository.findOne({
          where: {
            id: readerId,
            deletedAt: IsNull(),
          },
          relations: ['loans'],
        }),
      ]);

      if (!copy) {
        throw new NotFoundException('Copy not found');
      }
      this.ensureCopyIsAvailable(copy);

      if (!reader) {
        throw new NotFoundException('Reader not found');
      }
      this.ensureReaderCanBorrow(reader, now);

      loanedAt ??= now;
      const loan = loanRepository.create({
        loanedAt,
        copy,
        reader,
        dueDate: LoansService.LOAN_DURATION.toDateFrom(loanedAt),
      });
      copy.status = 'borrowed';
      await copyRepository.save(copy);
      const saved = await loanRepository.save(loan);
      return saved;
    });

    return LoanResponseDto.fromEntity(loan);
  }

  async return(
    loanId: number,
    { readerId }: ReturnCopyDto,
  ): Promise<LoanResponseDto> {
    const loan = await this.datasource.transaction(async (manager) => {
      const now = new Date();
      const loanRepository = manager.getRepository(Loan);
      const copyRepository = manager.getRepository(Copy);
      const readerRepository = manager.getRepository(Reader);
      const [loan, reader] = await Promise.all([
        loanRepository.findOne({
          relations: ['copy', 'reader'],
          where: {
            id: loanId,
            deletedAt: IsNull(),
            reader: { id: readerId },
          },
        }),
        readerRepository.findOne({
          where: {
            id: readerId,
            deletedAt: IsNull(),
          },
        }),
      ]);
      if (!loan) {
        throw new NotFoundException('Loan not found');
      }
      if (loan.returnedAt) {
        throw new ConflictException('Loan is already returned');
      }

      if (!reader) {
        throw new NotFoundException('Reader not found');
      }

      if (this.loanIsOverTolerancePeriod(loan, now)) {
        // Revoking suspension is done manually by a librarian
        reader.status = 'suspended';
        await readerRepository.save(reader);
      }

      loan.returnedAt = now;
      loan.copy.status = 'available';
      await copyRepository.save(loan.copy);
      return await loanRepository.save(loan);
    });

    return LoanResponseDto.fromEntity(loan);
  }

  async cancel(loanId: number): Promise<LoanResponseDto> {
    const loan = await this.datasource.transaction(async (manager) => {
      const loanRepository = manager.getRepository(Loan);
      const copyRepository = manager.getRepository(Copy);
      const loanToCancel = await loanRepository.findOne({
        relations: ['copy', 'reader'],
        where: {
          id: loanId,
          deletedAt: IsNull(),
        },
      });
      if (!loanToCancel) {
        throw new NotFoundException('Loan not found');
      }
      if (loanToCancel.returnedAt) {
        throw new ConflictException('Loan is already returned');
      }
      loanToCancel.deletedAt = new Date();
      await copyRepository.update(loanToCancel.copy.id, {
        status: 'available',
      });
      return await loanRepository.save(loanToCancel);
    });

    return LoanResponseDto.fromEntity(loan);
  }

  private loanIsOverTolerancePeriod(
    loan: Loan,
    now: Date = new Date(),
  ): boolean {
    console.log('Loan due date:', typeof loan.dueDate);
    if (now.getTime() <= loan.dueDate.getTime()) {
      return false;
    }
    return (
      now.getTime() - loan.dueDate.getTime() >
      LoansService.TOLERANCE_PERIOD.milliseconds
    );
  }

  private ensureReaderCanBorrow(reader: Reader, now: Date): void {
    const activeLoans = reader.loans.filter((loan) => !loan.returnedAt);
    if (activeLoans.some((loan) => loan.getStatus(now) === 'overdue')) {
      throw new ConflictException('Reader has an overdue loan');
    }
    if (activeLoans.length >= LoansService.READER_MAX_LOANS) {
      throw new ConflictException(
        'Reader has reached the maximum number of loans',
      );
    }
  }

  private ensureCopyIsAvailable(copy: Copy): void {
    if (copy.status !== 'available') {
      throw new ConflictException('Copy is not available');
    }
  }
}
