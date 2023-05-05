import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

jest.mock('../role/role.service');

describe('Role Controller', () => {
  let controller: RoleController;
  let roleService: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        RoleController,
      ],
      providers: [
        RoleService,
      ],
    }).compile();

    roleService = module.get<RoleService>(RoleService);
    controller = module.get<RoleController>(RoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
