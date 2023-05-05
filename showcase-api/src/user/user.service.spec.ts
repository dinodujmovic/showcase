/* eslint-disable @typescript-eslint/camelcase, @typescript-eslint/no-use-before-define, @typescript-eslint/ban-ts-ignore*/

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { CreateUserDto, GetUserDto, GetUserRawDto } from './dto/user.dto';

import * as uuid from 'uuid/v4';
import * as bcrypt from 'bcrypt';

import { config } from '../../config';
import { TokenDto } from '../auth/dto/auth.dto';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { create } from 'domain';

jest.mock('../auth/auth.service');
jest.mock('@nestjs/jwt');

describe('UserService', () => {
  let service: UserService;
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        AuthService,
        JwtService,
        { provide: getRepositoryToken(UserEntity), useFactory: repositoryMockFactory },
      ],
    }).compile();

    repositoryMock = module.get(getRepositoryToken(UserEntity));
    jwtService = module.get<JwtService>(JwtService);
    authService = module.get<AuthService>(AuthService);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {

    const expectedValue: GetUserDto[] = [
      {
        id: getUserRawDto1.u_id,
        username: getUserRawDto1.u_username,
        email: getUserRawDto1.u_email,
        profileImg: getUserRawDto1.u_image_url,
        role: getUserRawDto1.r_name,
      },
      {
        id: getUserRawDto2.u_id,
        username: getUserRawDto2.u_username,
        email: getUserRawDto2.u_email,
        profileImg: getUserRawDto2.u_image_url,
        role: getUserRawDto2.r_name,
      },
    ];

    repositoryMock.createQueryBuilder().getRawMany.mockReturnValue(getUsersRawDtoRepoMock);
    expect(await service.findAll()).toEqual(expectedValue);
  });

  it('should return one user by id', async () => {

    const expectedValue: GetUserDto = {
      id: getUserRawDto1.u_id,
      username: getUserRawDto1.u_username,
      email: getUserRawDto1.u_email,
      profileImg: getUserRawDto1.u_image_url,
      role: getUserRawDto1.r_name,
    };

    repositoryMock.createQueryBuilder().getRawOne.mockReturnValue(getUserRawDto1);
    expect(await service.findOneById(getUserRawDto1.u_id)).toEqual(expectedValue);
  });

  it('should return one user by username or email', async () => {

    const findByUsernameExpectedValue: GetUserDto = {
      id: getUserRawDto1.u_id,
      username: getUserRawDto1.u_username,
      email: getUserRawDto1.u_email,
      profileImg: getUserRawDto1.u_image_url,
      role: getUserRawDto1.r_name,
    };

    const findByEmailExpectedValue: GetUserDto = {
      id: getUserRawDto2.u_id,
      username: getUserRawDto2.u_username,
      email: getUserRawDto2.u_email,
      profileImg: getUserRawDto2.u_image_url,
      role: getUserRawDto2.r_name,
    };

    repositoryMock.createQueryBuilder().getRawOne.mockReturnValue(getUserRawDto1);
    expect(await service.findByUsernameOrEmail('Dino')).toEqual(findByUsernameExpectedValue);
    repositoryMock.createQueryBuilder().getRawOne.mockReturnValue(getUserRawDto2);
    expect(await service.findByUsernameOrEmail('f0rest@gmail.com')).toEqual(findByEmailExpectedValue);
    repositoryMock.createQueryBuilder().getRawOne.mockReturnValue(undefined);
    expect(await service.findByUsernameOrEmail('not_existing')).toBeUndefined();
  });

  it('should return one user by username and password', async () => {

    const expectedValue: GetUserDto = {
      id: getUserRawDto1.u_id,
      username: getUserRawDto1.u_username,
      email: getUserRawDto1.u_email,
      profileImg: getUserRawDto1.u_image_url,
      role: getUserRawDto1.r_name,
    };

    repositoryMock.createQueryBuilder().getRawOne.mockReturnValue(getUserRawDto1);

    expect(await service
      .findByUsernameAndPassword('Dino', 'dino1234'))
      .toEqual(expectedValue);

    expect(await service
      .findByUsernameAndPassword('Dino', 'badpassword'))
      .toBeUndefined();
  });

  it('should create new user', async () => {

    const id = uuid();
    const expectedToken = 'EXPECTED_TOKEN';

    const createUserValue: CreateUserDto = {
      username: 'NewUser',
      email: 'newuser@gmail.com',
      password: 'f0rest1234',
      matchingPassword: '123456',
    };

    jest.spyOn(authService, 'login')
      .mockImplementation((user: GetUserDto): Promise<TokenDto> => {
        const { id, username, email, profileImg, role } = user;
        return new Promise((resolve) => {
          resolve({
            token: expectedToken,
            user: {
              id,
              username,
              email,
              profileImg,
              role,
            },
          });
        });
      });

    const hashedPw = await bcrypt.hash(createUserValue.password, config.bcrypt.saltRounds);
    const saveUserReturnValue: UserEntity = {
      id: id,
      username: createUserValue.username,
      email: createUserValue.email,
      profileImg: null,
      password: hashedPw,
      roleId: 2,
    };

    const getRawUserValue = {
      u_id: id,
      u_username: createUserValue.username,
      u_password: hashedPw,
      u_email: createUserValue.email,
      u_image_url: null,
      r_name: 'USER',
    };

    const expectedValue: TokenDto = {
      user: {
        id: id,
        username: createUserValue.username,
        email: createUserValue.email,
        profileImg: null,
        role: 'USER',
      },
      token: expectedToken,
    };

    repositoryMock.save.mockReturnValue(saveUserReturnValue);
    repositoryMock.createQueryBuilder().getRawOne.mockReturnValue(getRawUserValue);

    const tokenDto: TokenDto = await service.create(createUserValue);

    expect(tokenDto).toEqual(expectedValue);
  });

  it('should delete user', async () => {
    const deleteUserReturnValue: UserEntity = {
      id: getUserRawDto1.u_id,
      username: getUserRawDto1.u_username,
      email: getUserRawDto1.u_email,
      profileImg: getUserRawDto1.u_image_url,
      password: getUserRawDto1.u_password,
      roleId: 1,
    };

    repositoryMock.delete.mockReturnValue(deleteUserReturnValue);

    const response = await service.deleteUser(getUserRawDto1.u_id);
    expect(response).toEqual(1);
  });
});

let repositoryMock: MockType<Repository<UserEntity>>;

export type MockType<T> = {
  save: any;
  delete: any;
  createQueryBuilder: jest.Mock<{
    getRawMany?: any;
    getRawOne?: any;
  }>;
};

// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  save: jest.fn(entity => entity),
  delete: jest.fn(entity => entity),
  createQueryBuilder: jest.fn().mockReturnValue({
    leftJoin: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockReturnThis(),
    getRawOne: jest.fn().mockReturnThis(),
  }),
}));


const getUserRawDto1: GetUserRawDto = {
  u_id: uuid(),
  u_username: 'Dino',
  u_password: '$2b$10$q3XwI9SYTqVb2AoKA/y2yOT8COTwcLND0jzeeO9DH.f8v8kfRVVKS', // dino1234
  u_email: 'dino@gmail.com',
  u_image_url: '/image/1234',
  r_name: 'ADMIN',
};

const getUserRawDto2: GetUserRawDto = {
  u_id: uuid(),
  u_username: 'f0rest',
  u_password: '$2b$10$mnDYQqgEqdIcleqynL2DwuT13RCNb2lzr24uFZQypufDkcExKKLC6', // f0rest1234
  u_email: 'f0rest@gmail.com',
  u_image_url: null,
  r_name: 'USER',
};

const getUsersRawDtoRepoMock: GetUserRawDto[] = [
  getUserRawDto1,
  getUserRawDto2,
];


