import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/users/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser({ email, password }: LoginUserDto) {
    const fondedUser = await this.usersService.findUserByEmail(email);
    console.log('found user', fondedUser);

    if (!fondedUser) return null;
    const isMatch = await bcrypt.compare(password, fondedUser.password);

    if (isMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...user } = fondedUser;
      return this.jwtService.sign(user);
    }
  }
  async login(user: User): Promise<{ access_token: string }> {
    const payload = { email: user.email, sub: user.id }; // Створюємо payload
    return {
      access_token: this.jwtService.sign(payload), // Генеруємо JWT токен
    };
  }
}
