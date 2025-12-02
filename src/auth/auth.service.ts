import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { User } from 'src/database/entities';
import { UsersService } from '../users/users.service';
import { AuthenticatedUser, JwtTokenPayload, TokenConfig } from './interfaces';
import { ACCESS_TOKEN_CONFIG, REFRESH_TOKEN_CONFIG } from './constants';
import { RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<AuthenticatedUser> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const authenticated = await bcrypt.compare(pass, user.hashedPassword);
    if (!authenticated) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const { hashedPassword, hashedRefreshToken, ...result } = user;
    return result as AuthenticatedUser;
  }

  async validateUserById(userId: string): Promise<AuthenticatedUser | null> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      return null;
    }

    const { hashedPassword, hashedRefreshToken, ...result } = user;
    return result as AuthenticatedUser;
  }

  async login(user: AuthenticatedUser, response: Response): Promise<void> {
    const tokenPayload: JwtTokenPayload = { sub: user.id };

    const accessToken = this.generateToken(tokenPayload, ACCESS_TOKEN_CONFIG);
    const refreshToken = this.generateToken(tokenPayload, REFRESH_TOKEN_CONFIG);

    this.setCookie(response, accessToken, ACCESS_TOKEN_CONFIG);
    this.setCookie(
      response,
      refreshToken,
      REFRESH_TOKEN_CONFIG,
      '/auth/refresh',
    );

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateUserRefreshToken(user.id, hashedRefreshToken);
  }

  async verifyUserRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<User> {
    const user = await this.usersService.findOneById(userId);

    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Access Denied.');
    }

    const authenticated = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );
    if (!authenticated) {
      throw new UnauthorizedException('Invalid Refresh Token.');
    }

    return user;
  }

  async register(dto: RegisterDto, response: Response): Promise<void> {
    const existing = await this.usersService.findOne(dto.email);
    if (existing) {
      throw new UnauthorizedException('User already exists.');
    }

    const passwordHashed = await bcrypt.hash(dto.password, 10);

    const newUser = new User({
      email: dto.email,
      hashedPassword: passwordHashed,
    });
    const savedUser = await this.usersService.create(newUser);

    const { hashedPassword, hashedRefreshToken, ...user } = savedUser;

    await this.login(user as AuthenticatedUser, response);
  }

  private generateToken(payload: JwtTokenPayload, config: TokenConfig): string {
    const expiresInMs = parseInt(
      this.configService.getOrThrow<string>(config.expirationMsKey),
    );

    return this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow(config.secretKey),
      expiresIn: `${expiresInMs}ms`,
    });
  }

  private setCookie(
    response: Response,
    token: string,
    config: TokenConfig,
    path: string = '/',
  ): void {
    const expiresInMs = parseInt(
      this.configService.getOrThrow<string>(config.expirationMsKey),
    );
    const expires = new Date(Date.now() + expiresInMs);

    response.cookie(config.cookieName, token, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires,
      path,
    });
  }
}
