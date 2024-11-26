import { Controller, Post, UseGuards, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { User } from 'src/users/entities/user.entity';

export type AuthReq = Request & { user: User };

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: AuthReq) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('status')
  status(@Req() req: AuthReq) {
    return {
      message: 'User is authenticated',
      user: req.user,
    };
  }
}
