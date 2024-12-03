import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  username: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}
