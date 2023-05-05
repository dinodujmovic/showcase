import { IsDate, IsEmail, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';


@Entity({ name: 'users' })
export class UserEntity {

  @IsString()
  @PrimaryColumn({ name: 'id', type: 'varchar' })
  public id: string;


  @IsString()
  @MinLength(4)
  @Column({ name: 'username', type: 'varchar' })
  public username: string;


  @IsEmail()
  @IsString()
  @Column({ name: 'email', type: 'varchar' })
  public email: string;


  @IsOptional()
  @IsUrl()
  @Column({ name: 'image_url', type: 'varchar' })
  public profileImg: string;


  @Column({ name: 'password', type: 'bytea' })
  public password: string;


  @Column({ name: 'role_id', type: 'int4' })
  public roleId: number;


  @IsDate()
  @Column({ name: 'register_datetime', type: 'timestamp' })
  public registerDateTime?: any;
}
