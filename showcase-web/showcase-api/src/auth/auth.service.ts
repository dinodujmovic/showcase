import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { GetUserDto } from '../user/dto/user.dto';
import { TokenDto, TokenPayload } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService) {
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user: GetUserDto = await this.userService.findByUsernameAndPassword(username, pass);

    if (user) {
      return user;
    }
    return null;
  }

  async login(user: GetUserDto): Promise<TokenDto> {
    const tokenPayload: TokenPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImg: user.profileImg,
    };

    const payload = {
      sub: tokenPayload,
    };

    return {
      user: tokenPayload,
      token: this.jwtService.sign(payload),
    };
  }
}
