import { ApiProperty } from '@nestjs/swagger';
import { GetUserDto } from '../../user/dto/user.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { MediaMetadataDto } from '../../common/media/media.dto';

export class GetPostDto {

  @ApiProperty()
  id: number;

  @ApiProperty()
  videoUrl: string;


  @ApiProperty()
  description: string;

  @ApiProperty()
  user: GetUserDto;

  @ApiProperty()
  datetime: string;
}

export class GetPostDtoAndCount {

  @ApiProperty()
  data: GetPostDto[];

  @ApiProperty()
  count: number;
}

export class GetPostRawDto {

  p_id: number;

  p_video_url: string;

  p_description: string;

  p_datetime: string;

  u_id: string;

  u_username: string;

  u_email: string;

  u_image_url: string;

  r_name: string;
}

export class UploadPostDto {

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @ApiProperty({ type: 'string', format: 'binary' })
  video: MediaMetadataDto;
}

export class CreatePostDto {

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  video: Express.Multer.File;

  @ApiProperty()
  userId: string;
}

export class DeletePostDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  postId: number;
}
