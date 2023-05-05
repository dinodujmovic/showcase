import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';


jest.mock('../post/post.service');
jest.mock('@nestjs/jwt');

describe('Post Controller', () => {
  let controller: PostController;
  let postService: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        PostController,
      ],
      providers: [
        PostService,
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
    controller = module.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
