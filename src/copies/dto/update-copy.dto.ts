import { IsEnum, IsOptional } from 'class-validator';
import { Copy } from '../entities/copy.entity';

export class UpdateCopyDto {
  @IsOptional()
  @IsEnum(Copy.status)
  status: Copy['status'];
}
