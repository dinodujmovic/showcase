import {
  Body, Controller, HttpStatus, UseGuards, UseInterceptors,
  Get, Post, Req, Res, UploadedFile, Delete, Param, HttpException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiUnsupportedMediaTypeResponse,
  ApiPayloadTooLargeResponse, ApiNotFoundResponse, ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { Response } from 'express';
import { diskStorage } from 'multer';

import { CreateUserDto, DeleteUserDto, GetUserDto, UpdateUserAvatarDto, UploadUserAvatarDto } from './dto/user.dto';
import { UserService } from './user.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { mediaConfig } from '../common/media/media.config';
import { AppLogger } from '../app.logger';
import { TokenDto } from '../auth/dto/auth.dto';


@ApiTags('users')
@Controller()
export class UserController {

  private logger = new AppLogger(UserController.name);

  constructor(readonly userService: UserService) {
  }

  // ================================
  //  Access: Authenticated (ADMIN)
  // ================================

  @Get('/users')
  @UseGuards(AuthGuard('jwt'), new RolesGuard(['ADMIN']))
  // Swagger
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK', type: [GetUserDto] })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ status: 500, description: 'Internal server error' })
  public async getAllUsers(@Res() res: Response, @Req() req): Promise<void> {
    const users: GetUserDto[] = await this.userService.findAll(req.user.id);

    if (!users) {
      this.logger.error('[getAllUsers] Server error', '');

      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    this.logger.debug('[getAllUsers] Return users');

    res.status(HttpStatus.OK).json(users);
  }


  @Delete('/users/:userId')
  @UseGuards(AuthGuard('jwt'), new RolesGuard(['ADMIN']))
  // Swagger
  @ApiBearerAuth()
  @ApiParam({ name: 'userId', type: 'string' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiInternalServerErrorResponse({ status: 500, description: 'Internal server error' })
  public async deleteUser(@Res() res: Response, @Param() param: DeleteUserDto): Promise<void> {

    const deleted = await this.userService.deleteUser(param.userId);

    if (!deleted) {
      this.logger.error(`[deleteUser] User ID ${param.userId} not found`, '');

      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    this.logger.debug(`[deleteUser] User ID: ${param.userId} deleted`);

    res.status(HttpStatus.OK).json(deleted);
  }


  // ================================
  //  Access: All
  // ================================

  @Post('/users')
  // Swagger
  @ApiCreatedResponse({ status: 201, description: 'Created', type: TokenDto })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
  async createUser(@Res() res: Response,
                   @Body() userData: CreateUserDto): Promise<void> {
    const tokenDto = await this.userService.create(userData);

    if (!tokenDto) {
      this.logger.error(`[createUser] User creation failed`, '');

      throw new HttpException('Internal Server Error', HttpStatus.BAD_REQUEST);
    }

    this.logger.debug(`[createUser] User ID: ${tokenDto.user.id} created and logged in`);

    res.status(HttpStatus.CREATED).json(tokenDto);
  }


  // ================================
  //  Access: Authenticated
  // ================================

  @Post('me/avatar')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage(mediaConfig.diskStorageConfig),
    limits: mediaConfig.imageFileSizeLimit,
    fileFilter: mediaConfig.imageFileFilter,
  }))
  // Swagger
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadUserAvatarDto,
  })
  @ApiCreatedResponse({ status: 201, description: 'Created', type: GetUserDto })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiPayloadTooLargeResponse({ status: 413, description: 'Payload Too Large' })
  @ApiUnsupportedMediaTypeResponse({ status: 415, description: 'Unsupported Media Type' })
  @ApiInternalServerErrorResponse({ status: 500, description: 'Internal Server Error' })
  public async uploadProfileAvatar(@Res() res: Response,
                                   @Req() req,
                                   @UploadedFile() file: Express.Multer.File) {

    if (!file) {
      this.logger.error(`[uploadProfileAvatar] Unsupported media type`, '');

      throw new HttpException('Unsupported Media Type', HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }

    const updateUserAvatar: UpdateUserAvatarDto = {
      userId: req.user.id,
      image: file,
    };

    const updatedUser: GetUserDto = await this.userService.setUserProfileImage(updateUserAvatar);

    if (!updatedUser) {
      this.logger.error(`[uploadProfileAvatar] User profile avatar failed`, '');

      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    this.logger.debug(`[uploadProfileAvatar] Avatar uploaded`);

    res.status(HttpStatus.CREATED).json(updatedUser);
  }
}
