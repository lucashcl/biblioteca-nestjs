import { Injectable } from '@nestjs/common';
import { CreateCopyDto } from './dto/create-copy.dto';
import { UpdateCopyDto } from './dto/update-copy.dto';
import { Copy } from './entities/copy.entity';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CopyResponseDto } from './dto/copy-response.dto';
import { Paginated, Pagination } from '../common/pagination/pagination';
import { CopyQueryDto } from './dto/copy-query.dto';

@Injectable()
export class CopiesService {
  constructor(
    @InjectRepository(Copy)
    private copiesRepository: Repository<Copy>,
  ) {}
  async create(
    bookId: number,
    createCopyDto: CreateCopyDto,
  ): Promise<CopyResponseDto[]> {
    const copies = Array.from({ length: createCopyDto.quantity }, () => {
      return this.copiesRepository.create({
        book: { id: bookId },
        status: 'available',
      });
    });
    const saved = await this.copiesRepository.save(copies);
    return saved.map((copy) => CopyResponseDto.fromEntity(copy));
  }

  async findAll(
    bookId: number,
    { status, page, pageSize }: CopyQueryDto,
  ): Promise<Paginated<CopyResponseDto>> {
    const offset = Pagination.calculateOffset(page, pageSize);
    const [copies, count] = await this.copiesRepository.findAndCount({
      skip: offset,
      take: pageSize,
      // overfetching data
      relations: ['book'],
      where: {
        deletedAt: IsNull(),
        status: status,
        book: {
          deletedAt: IsNull(),
          id: bookId,
        },
      },
    });
    return Pagination.create({
      data: copies.map((copy) => CopyResponseDto.fromEntity(copy)),
      page,
      pageSize,
      totalItems: count,
    });
  }

  async findOne(bookId: number, id: number): Promise<CopyResponseDto | null> {
    const copy = await this.copiesRepository.findOne({
      relations: ['book'],
      where: {
        id,
        book: { id: bookId },
        deletedAt: IsNull(),
      },
    });
    return copy ? CopyResponseDto.fromEntity(copy) : null;
  }

  async update(bookId: number, id: number, updateCopyDto: UpdateCopyDto) {
    const copy = await this.copiesRepository.findOne({
      where: {
        id,
        book: { id: bookId },
        deletedAt: IsNull(),
      },
      relations: ['book'],
    });
    if (!copy) {
      return null;
    }
    this.copiesRepository.merge(copy, updateCopyDto);
    const saved = await this.copiesRepository.save(copy);
    return CopyResponseDto.fromEntity(saved);
  }

  async remove(bookId: number, id: number) {
    const copy = await this.copiesRepository.findOne({
      where: {
        id,
        book: { id: bookId },
        deletedAt: IsNull(),
      },
      relations: ['book'],
    });
    if (!copy) {
      return null;
    }
    copy.deletedAt = new Date();
    const saved = await this.copiesRepository.save(copy);
    return CopyResponseDto.fromEntity(saved);
  }
}
