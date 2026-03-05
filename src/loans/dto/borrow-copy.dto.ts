import { IsDate, IsInt, IsOptional } from 'class-validator';

export class BorrowCopyDto {
  @IsInt()
  copyId: number;
  @IsInt()
  readerId: number;
  @IsOptional()
  @IsDate()
  loanedAt?: Date;
}
