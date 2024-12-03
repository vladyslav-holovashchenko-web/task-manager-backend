import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(
    user: User,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    await this.updateRefreshToken(user.id, refreshToken);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  generateAccessToken(user: User): string {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });
  }

  generateRefreshToken(user: User): string {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
  }

  async refresh(refreshToken: string): Promise<User> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.usersService.findUserById(payload.sub);
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return user;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const user = await this.usersService.findUserById(userId);
    if (user) {
      user.refreshToken = refreshToken;
      await this.usersService.updateRefreshToken(user);
    }
  }
}
