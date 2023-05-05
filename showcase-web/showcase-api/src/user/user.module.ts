import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entity/user.entity';
import { UserDoesntExistValidator, UserExistsValidator } from './user.validator';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => AuthModule),
  ],
  providers: [
    UserExistsValidator,
    UserDoesntExistValidator,
    UserService,
  ],
  controllers: [
    UserController,
  ],
  exports: [
    UserExistsValidator,
    UserDoesntExistValidator,
    UserService,
  ],
})
export class UserModule {
  static entities = [
    UserEntity,
  ];
}
