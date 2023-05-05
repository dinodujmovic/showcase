import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as uuid from 'uuid/v4';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';

import { CreateUserDto, GetUserDto, GetUserRawDto, UpdateUserAvatarDto } from './dto/user.dto';
import { UserEntity } from './entity/user.entity';
import { RoleEntity } from '../role/entity/role.entity';
import { getUserRawToUserDto, getUsersRawToUsersDto } from './dto/user.mapper';
import { config } from '../../config';
import { AppLogger } from '../app.logger';
import { AuthService } from '../auth/auth.service';
import { TokenDto } from '../auth/dto/auth.dto';
import { DateTime } from 'luxon';


@Injectable()
export class UserService {

  private logger = new AppLogger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {
  }

  private getUsersSQB() {
    return this.userRepository
      .createQueryBuilder('u')
      .leftJoin(RoleEntity, 'r', 'r.id = u.roleId')
      .select(['u', 'r']);
  }

  public async findAll(id?: string): Promise<GetUserDto[] | undefined> {

    const users: GetUserRawDto[] = await this.getUsersSQB()
      .where('u.id != :id', { id: id })
      .getRawMany();

    if (!users) {
      this.logger.error('[findAll] No users', '');

      return;
    }

    this.logger.debug(`[findAll] Return users`);

    return getUsersRawToUsersDto(users);
  }

  public async findOneById(id: string): Promise<GetUserDto | undefined> {
    const user: GetUserRawDto = await this.getUsersSQB()
      .where('u.id = :id', { id: id })
      .getRawOne();

    if (!user) {
      this.logger.error(`[findOneById] User ( ID: ${id}) not found`, '');

      return;
    }

    this.logger.debug(`[findOneById] Return user (ID: ${id})`);

    return getUserRawToUserDto(user);
  }

  public async findByUsernameOrEmail(usernameOrEmail: string): Promise<GetUserDto | undefined> {
    const user: GetUserRawDto = await this.getUsersSQB()
      .where('u.username = :username', { username: usernameOrEmail })
      .orWhere('u.email = :email', { email: usernameOrEmail })
      .getRawOne();

    if (!user) {
      this.logger.error(`[findByUsernameOrEmail] User ( usernameOrEmail: ${usernameOrEmail}) not found`, '');

      return;
    }

    this.logger.debug(`[findOneById] Return user ( usernameOrEmail: ${usernameOrEmail})`);

    return getUserRawToUserDto(user);
  }

  public async findByUsernameAndPassword(username: string, password: string): Promise<GetUserDto | undefined> {
    const user: GetUserRawDto = await this.getUsersSQB()
      .where('u.username = :username', { username: username })
      .getRawOne();

    if (!user) {
      this.logger.error(`[findByUsernameAndPassword] User ( username: ${username}) not found`, '');

      return;
    }

    const match = await bcrypt.compare(password, user.u_password);

    if (!match) {
      this.logger.error(`[findByUsernameAndPassword] Wrong password`, '');

      return;
    }

    this.logger.debug(`[findByUsernameAndPassword] Return user ( username: ${username})`);

    return getUserRawToUserDto(user);
  }

  public async create(user: CreateUserDto): Promise<TokenDto | undefined> {
    const newUser = new UserEntity();
    newUser.id = uuid();
    newUser.username = user.username;
    newUser.email = user.email;
    newUser.roleId = 2;
    newUser.password = await bcrypt.hash(user.password, config.bcrypt.saltRounds);
    newUser.registerDateTime = DateTime.utc();

    const savedUser: UserEntity = await this.userRepository.save(newUser);

    if (!savedUser) {
      this.logger.error(`[create] User not created`, '');

      return;
    }

    this.logger.debug(`[create] Create user (ID: ${savedUser.id})`);

    return await this.authService.login(await this.findOneById(savedUser.id));
  }

  public async deleteUser(userId: string): Promise<number | undefined> {
    const existingUser: GetUserDto = await this.findOneById(userId);

    if (!existingUser) {
      this.logger.error(`[deleteUser] User (ID: ${userId}) not found`, '');

      return;
    }

    const deletedUser = await this.userRepository.delete(userId);

    if (!deletedUser) {
      this.logger.debug(`[deleteUser] User (ID: ${userId}) not deleted`);

      return;
    }

    this.logger.debug(`[deletePost] User (ID: ${userId}) deleted`);

    return 1;
  }

  public async setUserProfileImage(updateUserAvatar: UpdateUserAvatarDto): Promise<GetUserDto | undefined> {
    const user: UserEntity = await this.userRepository.findOne(updateUserAvatar.userId);

    if (!user) {
      this.logger.error(`[setUserProfileImage] User not found (ID: ${user.id})`, '');

      return;
    }

    const previousImagePath = `${config.dataPath}${user.profileImg}`;

    try {
      // Remove previous image
      fs.unlinkSync(previousImagePath);
      this.logger.debug(`[setUserProfileImage] Previous profile image removed from the disk (${user.profileImg})`);

    } catch (err) {
      this.logger.error(`[setUserProfileImage] Previous profile image not removed from the disk (${user.profileImg})`, '');
    }

    user.profileImg = updateUserAvatar.image.path.replace(`${config.dataPath}`, '');

    const updatedUser = await this.userRepository.save(user);

    if (!updatedUser) {
      this.logger.error(`[setUserProfileImage] User profile image not updated`, '');

      return;
    }

    this.logger.debug(`[setUserProfileImage] User profile image update`);

    return this.findOneById(updatedUser.id);
  }
}
