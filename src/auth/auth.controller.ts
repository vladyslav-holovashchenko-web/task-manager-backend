import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  Res,
  UnauthorizedException,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body(ValidationPipe) registerUserDto: RegisterUserDto) {
    const { email, username, password } = registerUserDto;

    const existingUser = await this.usersService.findUserByEmail(email);
    const existingUsername =
      await this.usersService.findUserByUsername(username);

    if (existingUser || existingUsername) {
      throw new ConflictException(
        'User with this email or username already exists',
      );
    }

    const user = await this.usersService.createUser(email, password, username);
    return this.authService.login(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() loginUserDto: User, @Res() res: Response) {
    const tokens = await this.authService.login(loginUserDto);

    res.cookie('refreshToken', tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.send({ access_token: tokens.access_token });
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const user = await this.authService.refresh(refreshToken);
    const newAccessToken = this.authService.generateAccessToken(user);

    res.send({ access_token: newAccessToken });
  }
}
