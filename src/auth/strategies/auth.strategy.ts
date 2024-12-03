import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<Omit<User, 'password'>> {
    const { email, sub } = payload;

    const user = sub
      ? await this.usersService.findUserById(+sub)
      : await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    const { password, ...result } = user;
    return result;
  }
}
