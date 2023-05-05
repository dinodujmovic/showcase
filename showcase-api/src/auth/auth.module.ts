import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { config } from '../../config';


@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      secret: config.jwt.jwtOptions.secret,
      signOptions: config.jwt.jwtOptions.signOptions,
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [
    AuthController,
  ],
  exports: [
    AuthService,
  ],
})
export class AuthModule {
}
