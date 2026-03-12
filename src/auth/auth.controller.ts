import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { UserDto } from './dtos/user.dto';
import { AuthGuard } from './auth.guard';
import type { Request } from 'express';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TokensResponseDto } from './dtos/tokens-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    description: 'User logged in successfully',
    type: TokensResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  @Public()
  @Post('/login')
  async login(@Body() body: UserDto) {
    return await this.authService.login(body.email, body.password);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiHeader({
    name: 'Authorization',
    description: "Use the user's refresh token",
  })
  @ApiOkResponse({
    description: 'Tokens refreshed successfully',
    type: TokensResponseDto,
  })
  @Post('/refresh')
  async refreshTokens(@Req() req: Request) {
    const refreshToken = AuthGuard.extractTokenFromHeader(req);
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token expired or missing');
    }
    return await this.authService.refreshTokens(refreshToken);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({
    description: 'User logged out successfully',
    content: {
      'application/json': {
        example: { message: 'User logged out successfully' },
      },
    },
  })
  @Post('/logout')
  async logout(@Req() req: Request) {
    const refreshToken = AuthGuard.extractTokenFromHeader(req);
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token expired or missing');
    }
    await this.authService.logout(refreshToken);
    return { message: 'User logged out successfully' };
  }
}
