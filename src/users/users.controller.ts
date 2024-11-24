import { Controller, Post, Body, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto'; // Новий DTO
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const { email, password } = registerUserDto;
    const existingUser = await this.usersService.findUserByEmail(email);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const user = await this.usersService.createUser(email, password);
    return await this.authService.login(user);
  }
}
