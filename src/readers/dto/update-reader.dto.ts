import { PartialType } from '@nestjs/mapped-types';
import { CreateReaderDto } from './create-reader.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { Reader } from '../entities/reader.entity';

export class UpdateReaderDto extends PartialType(CreateReaderDto) {
  @IsOptional()
  @IsEnum(Reader.status)
  status?: Reader['status'];
}
