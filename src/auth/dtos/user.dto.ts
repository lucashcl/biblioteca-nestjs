import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

@ApiSchema({
  name: 'UserDto',
  description:
    'Login credentials for a user (a default user is created on app startup with the credentials defined in the environment variables ADMIN_EMAIL and ADMIN_PASSWORD)',
})
export class UserDto {
  @ApiProperty({ format: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ format: 'password' })
  @IsString()
  password: string;
}
