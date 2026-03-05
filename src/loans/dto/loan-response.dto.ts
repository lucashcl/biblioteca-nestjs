import { Loan } from '../entities/loan.entity';

export class LoanResponseDto {
  id: number;
  readerId: number;
  copyId: number;
  loanedAt: Date;
  dueDate: Date;
  // The status of the loan won't be returned because it would make the GET requests not idempotent
  returnedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(loan: Loan): LoanResponseDto {
    const dto = new LoanResponseDto();
    dto.id = loan.id;
    dto.readerId = loan.reader.id;
    dto.copyId = loan.copy.id;
    dto.loanedAt = loan.loanedAt;
    dto.dueDate = loan.dueDate;
    dto.returnedAt = loan.returnedAt;
    dto.createdAt = loan.createdAt;
    dto.updatedAt = loan.updatedAt;
    return dto;
  }
}
