import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/pagination/pagination-query.dto';
import { Reader } from '../entities/reader.entity';

export class ReaderQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(Reader.status)
  status?: Reader['status'];
}
