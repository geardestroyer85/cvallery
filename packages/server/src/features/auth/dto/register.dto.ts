import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'The unique name',
    example: 'username',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'The valid email for the registration',
    example: 'sample@email.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;


  @ApiProperty({
    description: 'The password',
    example: 'password',
  })
  @IsString()
  password: string;
}