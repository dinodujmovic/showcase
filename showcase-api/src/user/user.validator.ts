import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';


@ValidatorConstraint({ name: 'userExistsValidator', async: true })
@Injectable()
export class UserExistsValidator implements ValidatorConstraintInterface {
  constructor(protected readonly userService: UserService) {
  }

  public async validate(usernameOrEmail: string) {
    if (!this.userService) {
      return true;
    }
    const user = await this.userService.findByUsernameOrEmail(usernameOrEmail);

    return (!user);
  }
}

@ValidatorConstraint({ name: 'userDoesntExistValidator', async: true })
@Injectable()
export class UserDoesntExistValidator implements ValidatorConstraintInterface {
  constructor(protected readonly userService: UserService) {
  }

  public async validate(usernameOrEmail: string, args: any) {
    if (!this.userService) {
      return true;
    }
    const user = await this.userService.findByUsernameOrEmail(usernameOrEmail);

    return (!!user);
  }

  defaultMessage(args: ValidationArguments) { // here you can provide default error message if validation failed
    const createUser: any = args.object;
    return `User not found`;
  }
}

@ValidatorConstraint({ name: 'passwordsMatchedValidator', async: false })
export class PasswordsMatchedValidator implements ValidatorConstraintInterface {

  validate(matchingPassword: string, args: ValidationArguments) {
    const userDto = args.object as CreateUserDto;
    // for async validations you must return a Promise<boolean> here
    return matchingPassword === userDto.password;
  }

  defaultMessage(args: ValidationArguments) { // here you can provide default error message if validation failed
    const createUser: any = args.object;
    return `Passwords are not matched: ${createUser.matchingPassword} !== ${createUser.password}`;
  }
}
