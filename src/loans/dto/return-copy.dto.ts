import { IsInt } from 'class-validator';

export class ReturnCopyDto {
  @IsInt()
  readerId: number;
}
