import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/pagination/pagination-query.dto';

export class CopyQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(['available', 'borrowed', 'lost'])
  status?: 'available' | 'borrowed' | 'lost';
}
