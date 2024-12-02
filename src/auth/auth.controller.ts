import {
  Controller,
  Post,
  UseGuards,
  Get,
  Req,
  Body,
  ConflictException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { User } from 'src/users/entities/user.entity';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { UsersService } from 'src/users/users.service';

export type AuthReq = Request & { user: User };

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async register(@Body() registerUserDto: RegisterUserDto) {
    const { email, password, username } = registerUserDto;
    const existingEmail = await this.usersService.findUserByEmail(email);
    const existingUsername =
      await this.usersService.findUserByUsername(username);

    if (existingEmail || existingUsername) {
      throw new ConflictException('User already exists');
    }

    const user = await this.usersService.createUser(email, password, username);
    return await this.authService.login(user);
  }

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
