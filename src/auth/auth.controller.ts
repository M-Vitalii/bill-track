import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { AllowAnon } from './decorators/allow-anon.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { RegisterDto } from './dto';
import { JwtRefreshAuthGuard, LocalAuthGuard } from './guards';
import type { AuthenticatedUser, AuthenticatedRequest } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @AllowAnon()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
  }

  @AllowAnon()
  @Post('register')
  async register(
    @Body() user: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.register(user, response);
  }

  @AllowAnon()
  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
  }

  @Get('profile')
  getProfile(@Req() req: AuthenticatedRequest) {
    return req.user;
  }
}
