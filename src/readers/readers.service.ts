import { Injectable } from '@nestjs/common';
import { CreateReaderDto } from './dto/create-reader.dto';
import { UpdateReaderDto } from './dto/update-reader.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reader } from './entities/reader.entity';
import { IsNull, Repository } from 'typeorm';
import { ReaderResponseDto } from './dto/reader-response.dto';
import { Paginated, Pagination } from '../common/pagination/pagination';
import { ReaderQueryDto } from './dto/reader-query.dto';

@Injectable()
export class ReadersService {
  constructor(
    @InjectRepository(Reader)
    private readersRepository: Repository<Reader>,
  ) {}
  async create(createReaderDto: CreateReaderDto): Promise<ReaderResponseDto> {
    const reader = this.readersRepository.create(createReaderDto);
    const saved = await this.readersRepository.save(reader);
    return ReaderResponseDto.fromEntity(saved);
  }

  async findAll({
    page,
    pageSize,
    status,
  }: ReaderQueryDto): Promise<Paginated<ReaderResponseDto>> {
    const offset = Pagination.calculateOffset(page, pageSize);
    const [readers, count] = await this.readersRepository.findAndCount({
      skip: offset,
      take: pageSize,
      order: {
        updatedAt: 'DESC',
      },
      where: {
        deletedAt: IsNull(),
        status: status,
      },
    });

    return Pagination.create({
      data: readers.map((reader) => ReaderResponseDto.fromEntity(reader)),
      page,
      pageSize,
      totalItems: count,
    });
  }

  async findOne(id: number) {
    const reader = await this.readersRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
    });
    return reader ? ReaderResponseDto.fromEntity(reader) : null;
  }

  async update(id: number, updateReaderDto: UpdateReaderDto) {
    const reader = await this.readersRepository.findOneBy({
      id,
      deletedAt: IsNull(),
    });
    if (!reader) {
      return null;
    }
    this.readersRepository.merge(reader, {
      ...updateReaderDto,
      updatedAt: new Date(),
    });
    const updated = await this.readersRepository.save(reader);
    return ReaderResponseDto.fromEntity(updated);
  }

  async remove(id: number) {
    const reader = await this.readersRepository.findOneBy({
      id,
      deletedAt: IsNull(),
    });
    if (!reader) {
      return null;
    }
    reader.deletedAt = new Date();
    const deleted = await this.readersRepository.save(reader);
    return ReaderResponseDto.fromEntity(deleted);
  }
}
