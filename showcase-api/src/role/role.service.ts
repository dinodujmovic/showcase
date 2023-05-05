import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoleEntity } from './entity/role.entity';
import { GetRoleDto } from './dto/role.dto';


@Injectable()
export class RoleService {

  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {
  }

  async findAll(): Promise<GetRoleDto[] | undefined> {
    const roles = await this.roleRepository.find();
    const rolesDto: GetRoleDto[] = [];

    if (!roles) {
      return;
    }

    roles.forEach((role: RoleEntity) => {
      const roleDto: GetRoleDto = {
        id: role.id,
        name: role.name,
      };
      rolesDto.push(roleDto);
    });

    return rolesDto;
  }
}
