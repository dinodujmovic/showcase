import { Controller, Get, HttpCode, HttpException, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';

import { RoleService } from './role.service';
import { GetPostDto } from '../post/dto/post.dto';


@ApiTags('roles')
@Controller()
export class RoleController {

  constructor(readonly roleService: RoleService) {
  }

  @Get('/roles')
  @UseGuards(AuthGuard('jwt'))
  // Swagger
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK', type: [GetPostDto] })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ status: 500, description: 'Internal server error' })
  public async findAll(@Res() res: Response): Promise<void> {
    const roles = await this.roleService.findAll();

    if (!roles) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    res.status(HttpStatus.OK).json(roles);
  }
}
