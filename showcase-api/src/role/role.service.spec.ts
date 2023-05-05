/* eslint-disable @typescript-eslint/camelcase, @typescript-eslint/no-use-before-define, @typescript-eslint/ban-ts-ignore*/

import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoleEntity } from './entity/role.entity';
import { Repository } from 'typeorm';
import { GetRoleDto } from './dto/role.dto';


describe('RoleService', () => {
  let service: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        { provide: getRepositoryToken(RoleEntity), useFactory: repositoryMockFactory },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    repositoryMock = module.get(getRepositoryToken(RoleEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return roles', async () => {
    const dbReturnValue = [
      { id: 1, name: 'ADMIN' },
      { id: 2, name: 'USER' },
    ];

    const expectedValue: GetRoleDto[] = [
      { id: 1, name: 'ADMIN' },
      { id: 2, name: 'USER' },
    ];

    repositoryMock.find.mockReturnValue(dbReturnValue);
    expect(await service.findAll()).toEqual(expectedValue);
  });
});

let repositoryMock: MockType<Repository<RoleEntity>>;

// https://stackoverflow.com/questions/46856156/how-to-interpret-p-in-keyof-t-and-tp-in-these-typescript-declarations
export type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};

// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  find: jest.fn(entity => entity),
}));
