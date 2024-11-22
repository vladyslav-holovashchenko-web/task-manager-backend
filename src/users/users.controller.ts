import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto'; // Новий DTO

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const { email, password } = registerUserDto;
    const existingUser = await this.usersService.findUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    return this.usersService.createUser(email, password);
  }
}
