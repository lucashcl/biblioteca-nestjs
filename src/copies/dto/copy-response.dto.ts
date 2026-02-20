import { Copy } from '../entities/copy.entity';

export class CopyResponseDto {
  id: number;
  bookId: number;
  status: 'available' | 'borrowed' | 'lost';
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(copy: Copy): CopyResponseDto {
    const dto = new CopyResponseDto();
    dto.id = copy.id;
    dto.bookId = copy.book.id;
    dto.status = copy.status;
    dto.createdAt = copy.createdAt;
    dto.updatedAt = copy.updatedAt;
    return dto;
  }
}
