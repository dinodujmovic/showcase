import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, Validate } from 'class-validator';
import { PasswordsMatchedValidator, UserExistsValidator } from '../user.validator';


export class GetUserDto {

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

export class GetUserRawDto {

  u_id: string;

  u_username: string;

  u_password: string;

  u_email: string;

  u_image_url: string;

  r_name: string;
}

export class CreateUserDto {

  @ApiProperty()
  @IsNotEmpty()
  @Validate(UserExistsValidator, {
    message: 'Username already exists',
  })
  @MinLength(3)
  @MaxLength(10)
  username: string;


  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @Validate(UserExistsValidator, {
    message: 'Email already exists',
  })
  email: string;


  @ApiProperty()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(15)
  password: string;


  @ApiProperty()
  @Validate(PasswordsMatchedValidator)
  @IsNotEmpty()
  matchingPassword: string;
}

export class DeleteUserDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class UploadUserAvatarDto {

  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}

export class UpdateUserAvatarDto {

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
