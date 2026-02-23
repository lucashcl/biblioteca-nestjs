import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { IsNull, Repository } from 'typeorm';
import { Paginated, Pagination } from '../common/pagination/pagination';
import { PaginationQueryDto } from '../common/pagination/pagination-query.dto';
import { BookResponseDto } from './dto/book-response.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}
  async create(createBookDto: CreateBookDto): Promise<BookResponseDto> {
    const book = this.booksRepository.create(createBookDto);
    const saved = await this.booksRepository.save(book);
    return BookResponseDto.fromEntity(saved);
  }

  async findAll({
    page,
    pageSize,
  }: PaginationQueryDto): Promise<Paginated<BookResponseDto>> {
    const offset = Pagination.calculateOffset(page, pageSize);
    const [books, count] = await this.booksRepository.findAndCount({
      skip: offset,
      take: pageSize,
      order: {
        updatedAt: 'DESC',
      },
      where: {
        deletedAt: IsNull(),
      },
    });

    return Pagination.create({
      data: books.map((book) => BookResponseDto.fromEntity(book)),
      page,
      pageSize,
      totalItems: count,
    });
  }

  async findOne(id: number): Promise<BookResponseDto | null> {
    const book = await this.booksRepository.findOneBy({
      id,
      deletedAt: IsNull(),
    });
    if (!book) {
      return null;
    }
    return BookResponseDto.fromEntity(book);
  }

  async findByIsbn(isbn: string): Promise<BookResponseDto | null> {
    const book = await this.booksRepository.findOneBy({
      isbn,
      deletedAt: IsNull(),
    });
    if (!book) {
      return null;
    }
    return BookResponseDto.fromEntity(book);
  }

  async update(
    id: number,
    updateBookDto: UpdateBookDto,
  ): Promise<BookResponseDto | null> {
    const book = await this.booksRepository.findOneBy({
      id,
      deletedAt: IsNull(),
    });
    if (!book) {
      return null;
    }
    this.booksRepository.merge(book, updateBookDto);
    const updated = await this.booksRepository.save(book);
    return BookResponseDto.fromEntity(updated);
  }

  async delete(id: number): Promise<BookResponseDto | null> {
    const book = await this.booksRepository.findOneBy({
      id,
      deletedAt: IsNull(),
    });
    if (!book) {
      return null;
    }
    book.deletedAt = new Date();
    const deleted = await this.booksRepository.save(book);
    return BookResponseDto.fromEntity(deleted);
  }
}
