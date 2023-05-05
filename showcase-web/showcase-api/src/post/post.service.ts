import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PostEntity } from './entity/post.entity';
import { UserEntity } from '../user/entity/user.entity';
import { CreatePostDto, GetPostDto, GetPostDtoAndCount, GetPostRawDto } from './dto/post.dto';
import { RoleEntity } from '../role/entity/role.entity';
import { getPostRawToPostDto, getPostsRawToPostsDto } from './dto/post.mapper';
import { config } from '../../config';
import { TokenPayload } from '../auth/dto/auth.dto';
import { DateTime } from 'luxon';

import * as fs from 'fs';
import { AppLogger } from '../app.logger';


@Injectable()
export class PostService {

  private logger = new AppLogger(PostService.name);

  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {
  }

  private getPostsSQB() {
    return this.postRepository
      .createQueryBuilder('p')
      .orderBy('p.datetime', 'DESC')
      .leftJoin(UserEntity, 'u', 'u.id = p.userId')
      .leftJoin(RoleEntity, 'r', 'r.id = u.roleId')
      .select(['p', 'u', 'r']);
  }

  public async findAll(query: { page: number, limit: number }): Promise<GetPostDtoAndCount | undefined> {
    const paginationQuery = this.getPostsSQB()
      .skip((query.page - 1) * query.limit)
      .take(query.limit);

    const { entities, raw }: { entities: PostEntity[], raw: GetPostRawDto[] } = await paginationQuery.getRawAndEntities();

    const count = await paginationQuery.getCount();

    if (!raw) {
      this.logger.error('[findAll] No posts', '');

      return;
    }

    this.logger.debug(`[findAll] Return posts`);

    return {
      data: getPostsRawToPostsDto(raw),
      count: count,
    };
  }

  public async findOneById(id: number): Promise<GetPostDto | undefined> {
    const post: GetPostRawDto = await this.getPostsSQB()
      .where('p.id = :id', { id: id })
      .getRawOne();

    if (!post) {
      this.logger.error(`[findOneById] Post ( ID: ${id}) not found`, '');

      return;
    }

    this.logger.debug(`[findOneById] Return post (ID: ${id})`);

    return getPostRawToPostDto(post);
  }

  public async create(post: CreatePostDto): Promise<GetPostDto | undefined> {
    const createPost: PostEntity = {
      videoUrl: post.video.path.replace(`${config.dataPath}`, ''),
      description: post.description,
      userId: post.userId,
      datetime: DateTime.utc(),
    };

    const savedPost: PostEntity = await this.postRepository.save(createPost);

    if (!savedPost) {
      this.logger.error(`[create] Post not created`, '');

      return;
    }

    this.logger.debug(`[create] Create post (ID: ${savedPost.id})`);

    return this.findOneById(savedPost.id);
  }

  public async deletePost(postId: number, user: TokenPayload): Promise<number | undefined> {
    let deletedUser;
    const existingPost: GetPostDto = await this.findOneById(postId);

    if (!existingPost) {
      this.logger.error(`[deletePost] Post (ID: ${postId}) not found`, '');

      return;
    }

    if (existingPost.user.id === user.id || user.role === 'ADMIN') {
      const videoUrl = `${config.dataPath}${existingPost.videoUrl}`;
      // remove file from disk
      try {
        fs.unlinkSync(videoUrl);

        this.logger.debug(`[deletePost] Video file (${existingPost.videoUrl}) removed from the disk`);
      } catch (err) {
        this.logger.error(`[deletePost] Video file (${existingPost.videoUrl}) not removed from the disk`, '');
      }

      deletedUser = await this.postRepository.delete(postId);
    }

    if (!deletedUser) {
      this.logger.debug(`[deletePost] Post (ID: ${postId}) not deleted`);

      return;
    }

    this.logger.debug(`[deletePost] Post (ID: ${postId}) deleted`);

    return 1;
  }
}
