import { IsISBN, IsNotEmpty } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  author: string;
  @IsISBN()
  isbn: string;
}
