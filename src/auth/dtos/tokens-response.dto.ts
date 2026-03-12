import { ApiProperty } from '@nestjs/swagger';

export class TokensResponseDto {
  @ApiProperty({ type: 'string', format: 'jwt' })
  accessToken: string;
  @ApiProperty({ type: 'string', format: 'jwt' })
  refreshToken: string;
}
