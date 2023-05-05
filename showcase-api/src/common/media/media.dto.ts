import { ApiProperty } from '@nestjs/swagger';

export class MediaMetadataDto {

  @ApiProperty()
  fieldname: string;

  @ApiProperty()
  originalname: string;

  @ApiProperty()
  encoding: string;

  @ApiProperty()
  mimetype: string;
}
