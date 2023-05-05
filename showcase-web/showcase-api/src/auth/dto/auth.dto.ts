import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;


  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class TokenPayload {

  @ApiProperty()
  id: string;


  @ApiProperty()
  username: string;


  @ApiProperty()
  email: string;


  @ApiProperty()
  profileImg: string;


  @ApiProperty()
  role: string;
}

export class TokenDto {

  @ApiProperty()
  user: TokenPayload;

  @ApiProperty()
  token: string;
}

