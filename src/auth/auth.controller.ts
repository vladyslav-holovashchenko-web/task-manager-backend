import { Controller, Post, UseGuards, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('status')
  status(@Req() req: Request) {
    return req.user;
  }
}
