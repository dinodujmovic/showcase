/* eslint-disable @typescript-eslint/camelcase, @typescript-eslint/no-use-before-define, @typescript-eslint/ban-ts-ignore*/

import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostEntity } from './entity/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto, GetPostDto, GetPostDtoAndCount, GetPostRawDto } from './dto/post.dto';

import * as uuid from 'uuid/v4';
import { DateTime } from 'luxon';
import { TokenPayload } from '../auth/dto/auth.dto';


describe('PostService', () => {
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostService,
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        { provide: getRepositoryToken(PostEntity), useFactory: repositoryMockFactory },
      ],
    }).compile();

    repositoryMock = module.get(getRepositoryToken(PostEntity));
    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return posts', async () => {
    const expectedValue: GetPostDtoAndCount = {
      data: [],
      count: 3,
    };

    getPostsRawDtoRepoMock.forEach((value: GetPostRawDto, i: number) => {
      expectedValue.data.push({
        id: getPostsRawDtoRepoMock[i].p_id,
        videoUrl: getPostsRawDtoRepoMock[i].p_video_url,
        datetime: getPostsRawDtoRepoMock[i].p_datetime,
        description: getPostsRawDtoRepoMock[i].p_description,
        user: {
          id: getPostsRawDtoRepoMock[i].u_id,
          profileImg: getPostsRawDtoRepoMock[i].u_image_url,
          username: getPostsRawDtoRepoMock[i].u_username,
          email: getPostsRawDtoRepoMock[i].u_email,
          role: getPostsRawDtoRepoMock[i].r_name,
        },
      });
    });

    repositoryMock.createQueryBuilder().getRawAndEntities.mockReturnValue({ raw: [...getPostsRawDtoRepoMock] });
    repositoryMock.createQueryBuilder().getCount.mockReturnValue(3);
    expect(await service.findAll({ page: 1, limit: 3 })).toEqual(expectedValue);

    repositoryMock.createQueryBuilder().getRawAndEntities.mockReturnValue({ raw: [getPostRawDto1, getPostRawDto2] });
    repositoryMock.createQueryBuilder().getCount.mockReturnValue(2);
    expect(await service.findAll({ page: 1, limit: 2 })).toEqual({
      data: [expectedValue.data[0], expectedValue.data[1]],
      count: 2,
    });

    repositoryMock.createQueryBuilder().getRawAndEntities.mockReturnValue({ raw: [getPostRawDto3] });
    repositoryMock.createQueryBuilder().getCount.mockReturnValue(1);
    expect(await service.findAll({ page: 2, limit: 3 })).toEqual({ data: [expectedValue.data[2]], count: 1 });
  });

  it('should create post', async () => {

    const videoMock: Express.Multer.File = {
      fieldname: 'video__1582062790911.mp4',
      originalname: 'video__1582062790911.mp4',
      encoding: 'encoding',
      mimetype: 'video/mp4',
      size: 25000,
      destination: getPostRawDto1.p_video_url,
      filename: 'video__1582062790911.mp4',
      path: 'video__1582062790911.mp4',
      buffer: new Buffer(''),
    };

    const createPost: CreatePostDto = {
      userId: getPostRawDto1.u_id,
      description: getPostRawDto1.p_description,
      video: videoMock,
    };

    const savePostMockReturnValue: PostEntity = {
      videoUrl: getPostRawDto1.p_video_url,
      description: getPostRawDto1.p_description,
      userId: getPostRawDto1.u_id,
      datetime: getPostRawDto1.p_datetime,
    };

    const findOneByIdRawMockReturnValue: GetPostRawDto = {
      p_id: 1,
      p_video_url: getPostRawDto1.p_video_url,
      p_description: getPostRawDto1.p_description,
      p_datetime: getPostRawDto1.p_datetime,
      u_id: getPostRawDto1.u_id,
      u_username: getPostRawDto1.u_username,
      u_email: getPostRawDto1.u_email,
      u_image_url: null,
      r_name: getPostRawDto1.r_name,
    };

    const expectedValue: GetPostDto = {
      id: 1,
      videoUrl: getPostRawDto1.p_video_url,
      description: getPostRawDto1.p_description,
      datetime: getPostRawDto1.p_datetime,
      user: {
        id: getPostRawDto1.u_id,
        username: getPostRawDto1.u_username,
        email: getPostRawDto1.u_email,
        profileImg: null,
        role: getPostRawDto1.r_name,
      },
    };

    repositoryMock.createQueryBuilder().getRawOne.mockReturnValue(findOneByIdRawMockReturnValue);
    repositoryMock.save.mockReturnValue(savePostMockReturnValue);

    expect(await service.create(createPost)).toEqual(expectedValue);
  });

  it('should delete post', async () => {
    const findOneByIdRawMockReturnValue: GetPostRawDto = {
      p_id: getPostRawDto1.p_id,
      p_video_url: getPostRawDto1.p_video_url,
      p_description: getPostRawDto1.p_description,
      p_datetime: getPostRawDto1.p_datetime,
      u_id: getPostRawDto1.u_id,
      u_username: getPostRawDto1.u_username,
      u_email: getPostRawDto1.u_email,
      u_image_url: null,
      r_name: 'ADMIN',
    };

    const deletedPostEntityReturnValue: PostEntity = {
      id: getPostRawDto1.p_id,
      videoUrl: getPostRawDto1.p_video_url,
      description: getPostRawDto1.p_description,
      userId: getPostRawDto1.u_id,
      datetime: getPostRawDto1.p_datetime,
    };

    repositoryMock.createQueryBuilder().getRawOne.mockReturnValue(findOneByIdRawMockReturnValue);
    repositoryMock.delete.mockReturnValue(deletedPostEntityReturnValue);

    // correct user ID - should delete
    const tokenPayload_1: TokenPayload = {
      id: getPostRawDto1.u_id,
      username: getPostRawDto1.u_username,
      email: getPostRawDto1.u_email,
      profileImg: null,
      role: 'USER',
    };

    expect(await service.deletePost(1, tokenPayload_1)).toEqual(1);

    // wrong user ID - can't delete
    const tokenPayload_2: TokenPayload = {
      id: getPostRawDto2.u_id,
      username: getPostRawDto2.u_id,
      email: getPostRawDto2.u_id,
      profileImg: null,
      role: 'USER',
    };
    expect(await service.deletePost(1, tokenPayload_2)).toBeUndefined();

    // wrong user ID && ADMIN - can delete
    const tokenPayload_3: TokenPayload = {
      id: getPostRawDto2.u_id,
      username: getPostRawDto2.u_username,
      email: getPostRawDto2.u_email,
      profileImg: null,
      role: 'ADMIN',
    };

    expect(await service.deletePost(1, tokenPayload_3)).toEqual(1);
  });
});

let repositoryMock: MockType<Repository<PostEntity>>;

export type MockType<T> = {
  save: any;
  delete: any;
  createQueryBuilder: jest.Mock<{
    getRawMany?: any;
    getRawOne?: any;
    getRawAndEntities?: any;
    getCount?: any;
  }>;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  save: jest.fn(entity => entity),
  delete: jest.fn(entity => entity),
  createQueryBuilder: jest.fn().mockReturnValue({
    leftJoin: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    getRawAndEntities: jest.fn().mockReturnThis(),
    getCount: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockReturnThis(),
    getRawOne: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  }),
}));

const getPostRawDto1: GetPostRawDto = {
  p_id: 1,
  p_video_url: '/71af9941-45df-4cdf-bec2-934dc8e1c513/video__1582062790911.mp4',
  p_description: 'Description Video 1',
  p_datetime: '2020-02-18T21:53:11.268Z',
  u_id: uuid(),
  u_username: 'Dino',
  u_email: 'dino@gmail.com',
  u_image_url: null,
  r_name: 'ADMIN',
};

const getPostRawDto2: GetPostRawDto = {
  p_id: 2,
  p_video_url: '/71af9941-45df-4cdf-bec2-934dc8e1c513/video__66665555.mp4',
  p_description: 'Description Video 2',
  p_datetime: '2020-03-18T21:55:22.268Z',
  u_id: uuid(),
  u_username: 'Maya',
  u_email: 'Maya@gmail.com',
  u_image_url: null,
  r_name: 'USER',
};

const getPostRawDto3: GetPostRawDto = {
  p_id: 3,
  p_video_url: '/71af9941-45df-4cdf-bec2-934dc8e1c513/video__777777.mp4',
  p_description: 'Description Video 3',
  p_datetime: '2020-04-18T24:66:22.268Z',
  u_id: uuid(),
  u_username: 'Igor',
  u_email: 'igor@gmail.com',
  u_image_url: null,
  r_name: 'USER',
};

const getPostsRawDtoRepoMock: GetPostRawDto[] = [
  getPostRawDto1,
  getPostRawDto2,
  getPostRawDto3,
];
