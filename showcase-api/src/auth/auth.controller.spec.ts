import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

jest.mock('../auth/auth.service');

describe('Auth Controller', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        AuthController
      ],
      providers: [
        AuthService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
