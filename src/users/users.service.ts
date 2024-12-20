import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(
    email: string,
    password: string,
    username: string,
  ): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async findUserById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOneBy({ username });
  }

  async updateRefreshToken(user): Promise<void> {
    await this.userRepository.save(user);
  }
}
