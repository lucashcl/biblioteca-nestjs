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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('/login')
  async login(@Body() body: UserDto) {
    return await this.authService.login(body.email, body.password);
  }

  @Post('/refresh')
  async refreshTokens(@Req() req: Request) {
    const refreshToken = AuthGuard.extractTokenFromHeader(req);
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token expired or missing');
    }
    return await this.authService.refreshTokens(refreshToken);
  }

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
