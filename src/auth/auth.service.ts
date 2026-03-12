import {
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import type { Redis } from 'ioredis';
import { RedisService } from '@nestjs-labs/nestjs-ioredis';
import { JwtService } from '@nestjs/jwt';
import argon from 'argon2';
import { Duration } from '../common/utils/duration';
import { TokensResponseDto } from './dtos/tokens-response.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly redis: Redis;
  public static readonly TokenDuration = Duration.fromDays(7);
  private readonly logger = new Logger(AuthService.name, { timestamp: true });
  constructor(
    private redisService: RedisService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    this.redis = this.redisService.getOrThrow();
  }

  async onModuleInit() {
    await this.seedAdminUser();
  }

  private async seedAdminUser() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword) {
      throw new Error(
        'Admin email and password must be set in environment variables',
      );
    }
    const existingAdmin = await this.usersService.findByEmail(adminEmail);
    if (!existingAdmin) {
      await this.usersService.create(adminEmail, adminPassword, {
        isAdmin: true,
      });
      this.logger.log('Admin user created successfully');
    }
  }

  private async validateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const isPasswordValid = await argon.verify(user.password, password);
    if (!isPasswordValid) return null;
    return user;
  }

  private async generateTokens(user: {
    id: number;
  }): Promise<TokensResponseDto> {
    const jti = crypto.randomUUID();
    const exp = AuthService.TokenDuration.seconds;
    await this.redis.set(`rt:${jti}`, String(user.id), 'EX', exp);
    const TokensResponse: TokensResponseDto = {
      accessToken: this.jwtService.sign(
        { sub: user.id, typ: 'access' },
        { expiresIn: Duration.fromHours(1).seconds },
      ),
      refreshToken: this.jwtService.sign(
        { sub: user.id, jti, typ: 'refresh' },
        { expiresIn: AuthService.TokenDuration.seconds },
      ),
    };
    return TokensResponse;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateTokens(user);
  }

  async getUser(accessToken: string): Promise<User> {
    let decoded: { sub: number; typ: string };
    try {
      decoded = this.jwtService.verify(accessToken);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    if (decoded.typ !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }
    const user = await this.usersService.findById(decoded.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async refreshTokens(refreshToken: string) {
    let decoded: { sub: number; jti: string; typ: string };
    try {
      decoded = this.jwtService.verify(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    if (decoded.typ !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }
    const storedUserId = await this.redis.get(`rt:${decoded.jti}`);
    if (storedUserId !== String(decoded.sub)) {
      throw new UnauthorizedException('Invalid token');
    }
    await this.redis.del(`rt:${decoded.jti}`);
    return this.generateTokens({ id: decoded.sub });
  }

  async logout(refreshToken: string) {
    let decoded: { jti: string; typ: string };
    try {
      decoded = this.jwtService.verify(refreshToken);
    } catch {
      return;
    }
    if (decoded.typ !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }
    await this.redis.del(`rt:${decoded.jti}`);
  }
}
