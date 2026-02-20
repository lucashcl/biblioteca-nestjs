import { IsInt, Min } from 'class-validator';

export class CreateCopyDto {
  @IsInt()
  @Min(1)
  quantity: number;
}
