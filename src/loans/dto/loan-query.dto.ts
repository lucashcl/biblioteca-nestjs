import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/pagination/pagination-query.dto';
import { Loan } from '../entities/loan.entity';

export class LoanQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(Loan.status)
  status?: ReturnType<Loan['getStatus']>;
}
