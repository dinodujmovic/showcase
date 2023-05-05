import {
  Get, Post, Req, Res, UploadedFile,
  Body, Controller, HttpStatus, UseGuards, UseInterceptors, HttpException, Delete, Param, Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiPayloadTooLargeResponse,
  ApiUnsupportedMediaTypeResponse,
  ApiParam, ApiNotFoundResponse, ApiUnauthorizedResponse, ApiQuery,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';

import { CreatePostDto, DeletePostDto, GetPostDto, GetPostDtoAndCount, UploadPostDto } from './dto/post.dto';
import { Response } from 'express';
import { PostService } from './post.service';
import { diskStorage } from 'multer';
import { mediaConfig } from '../common/media/media.config';
import { AppLogger } from '../app.logger';


@ApiTags('posts')
@Controller()
export class PostController {

  private logger = new AppLogger(PostController.name);

  constructor(readonly postService: PostService) {
  }

  @Get('/posts')
  // Swagger
  @ApiBearerAuth()
  @ApiImplicitQuery({ name: 'page', type: 'number', required: false })
  @ApiImplicitQuery({ name: 'limit', type: 'number', required: false })
  @ApiResponse({ status: 200, description: 'OK', type: GetPostDtoAndCount })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ status: 500, description: 'Internal server error' })
  public async getPosts(@Res() res: Response,
                        @Query('page') page = 1,
                        @Query('limit') limit = 10) {

    const posts: GetPostDtoAndCount = await this.postService.findAll({ page, limit });

    if (!posts) {
      this.logger.error('[getPosts] Server error', '');

      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    this.logger.debug(`[getPosts] Return posts`);

    res.status(HttpStatus.OK).json(posts);
  }

  @Post('/posts')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('video', {
    storage: diskStorage(mediaConfig.diskStorageConfig),
    limits: mediaConfig.videoFileSizeLimit,
    fileFilter: mediaConfig.videoFileFilter,
  }))
  // Swagger
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadPostDto,
  })
  @ApiCreatedResponse({ status: 201, description: 'Created', type: GetPostDto })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiPayloadTooLargeResponse({ status: 413, description: 'Payload Too Large' })
  @ApiUnsupportedMediaTypeResponse({ status: 415, description: 'Unsupported Media Type' })
  @ApiInternalServerErrorResponse({ status: 500, description: 'Internal Server Error' })
  async createPost(@Res() res: Response,
                   @Req() req: any,
                   @UploadedFile() file: Express.Multer.File,
                   @Body() postData: UploadPostDto): Promise<void> {

    if (!file) {
      this.logger.error(`[createPost] Unsupported media type`, '');

      throw new HttpException('Unsupported Media Type!', HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }

    const post: CreatePostDto = {
      video: file,
      description: postData.description,
      userId: req.user.id,
    };

    const createdPost: GetPostDto = await this.postService.create(post);

    if (!createdPost) {
      this.logger.error(`[createPost] Create post failed`, '');

      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    this.logger.debug(`[createPost] Post ID: ${createdPost.id} created`);

    res.status(HttpStatus.CREATED).json(createdPost);
  }

  @Delete('/posts/:postId')
  @UseGuards(AuthGuard('jwt'))
  // Swagger
  @ApiBearerAuth()
  @ApiParam({ name: 'postId', type: 'number' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiInternalServerErrorResponse({ status: 500, description: 'Internal server error' })
  public async deletePost(@Res() res: Response, @Req() req, @Param() param: DeletePostDto): Promise<void> {

    const deleted = await this.postService.deletePost(param.postId, req.user);

    if (!deleted) {
      this.logger.error(`[deletePost] Post ID ${param.postId} not found!`, '');

      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    this.logger.debug(`[deletePost] Post ID: ${param.postId} deleted`);

    res.status(HttpStatus.OK).json(deleted);
  }
}
