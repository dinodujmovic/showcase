import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostEntity } from './entity/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity]),
  ],
  providers: [
    PostService,
  ],
  controllers: [
    PostController,
  ],
})
export class PostModule {
  static entities = [
    PostEntity,
  ];
}
