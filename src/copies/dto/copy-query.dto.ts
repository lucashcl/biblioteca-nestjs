import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/pagination/pagination-query.dto';
import { Copy } from '../entities/copy.entity';

export class CopyQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(Copy.status)
  status?: Copy['status'];
}
