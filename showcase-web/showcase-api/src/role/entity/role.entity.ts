import { IsString } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'roles' })
export class RoleEntity {

  @IsString()
  @PrimaryColumn({ type: 'int4' })
  public id: number;


  @IsString()
  @Column({ type: 'varchar', length: 50 })
  public name: string;
}
