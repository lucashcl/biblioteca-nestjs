import { IsEnum, IsOptional } from 'class-validator';

export class UpdateCopyDto {
  @IsOptional()
  @IsEnum(['available', 'borrowed', 'lost'])
  status: 'available' | 'borrowed' | 'lost';
}
