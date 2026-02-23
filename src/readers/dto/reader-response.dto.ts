import { Reader } from '../entities/reader.entity';

export class ReaderResponseDto {
  id: number;
  name: string;
  email?: string;
  phone: string;
  address: string;
  status: Reader['status'];
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(reader: Reader): ReaderResponseDto {
    const dto = new ReaderResponseDto();
    dto.id = reader.id;
    dto.name = reader.name;
    dto.email = reader.email;
    dto.phone = reader.phone;
    dto.address = reader.address;
    dto.status = reader.status;
    dto.createdAt = reader.createdAt;
    dto.updatedAt = reader.updatedAt;
    return dto;
  }
}
