import { Book } from '../entities/book.entity';

export class BookResponseDto {
  id: number;
  title: string;
  author: string;
  isbn: string;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(book: Book): BookResponseDto {
    const dto = new BookResponseDto();
    dto.id = book.id;
    dto.title = book.title;
    dto.author = book.author;
    dto.isbn = book.isbn;
    dto.createdAt = book.createdAt;
    dto.updatedAt = book.updatedAt;
    return dto;
  }
}
