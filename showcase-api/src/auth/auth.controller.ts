import { Get, Post, Req, Headers, Body, Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto, TokenDto, TokenPayload } from './dto/auth.dto';
import { AppLogger } from '../app.logger';


@ApiTags('auth')
@Controller('auth')
export class AuthController {

  private logger = new AppLogger(AuthController.name);

  constructor(private readonly authService: AuthService) {
  }


  @Post('login')
  @UseGuards(AuthGuard('local'))
  // Swagger
  @ApiResponse({ status: 200, description: 'OK', type: TokenDto })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  public async login(@Req() req, @Body() loginData: LoginDto): Promise<TokenDto> {
    this.logger.debug(`[login] User ${loginData.username} logging`);
    return this.authService.login(req.user);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  // Swagger
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK', type: TokenDto })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Req() req, @Headers('authorization') authorizationHeader): TokenDto {
    this.logger.debug(`[me] Get profile: ${JSON.stringify(req.user)}`);

    return {
      user: req.user,
      token: authorizationHeader.replace('Bearer ', ''),
    };
  }
}
