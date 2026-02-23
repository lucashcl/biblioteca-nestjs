import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateReaderDto {
  @IsNotEmpty()
  name: string;
  @IsOptional()
  @IsEmail()
  email?: string;
  @IsNotEmpty()
  @IsPhoneNumber('BR')
  phone: string;
  @IsString()
  @IsNotEmpty()
  address: string;
}
