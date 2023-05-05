import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';
import { AppLogger } from '../../app.logger';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

  private logger = new AppLogger(LocalStrategy.name);

  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      this.logger.error(`[local.strategy validate] Wrong username or password: '${username}'.`, '');

      throw new UnauthorizedException();
    }

    this.logger.debug(`[local.strategy validate] User ${username} found`);
    return user;
  }
}
