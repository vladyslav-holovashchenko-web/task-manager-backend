import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser({ email, password }: LoginUserDto) {
    const user = await this.usersService.findUserByEmail(email);

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return null;

    return await this.generateJwtToken(user);
  }

  async generateJwtToken(user: User) {
    return this.jwtService.sign({ email: user.email, sub: user.id });
  }
}
