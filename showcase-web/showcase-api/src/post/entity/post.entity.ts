import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsDate, IsNumber, IsString, IsUrl } from 'class-validator';

@Entity({ name: 'posts' })
export class PostEntity {

  @IsNumber()
  @PrimaryGeneratedColumn({ name: 'id', type: 'int4' })
  public id?: number;


  @IsString()
  @IsUrl()
  @Column({ name: 'video_url', type: 'varchar' })
  public videoUrl: string;


  @IsString()
  @Column({ name: 'description', type: 'varchar' })
  public description: string;


  @IsString()
  @Column({ name: 'user_id', type: 'varchar' })
  public userId: string;


  @IsDate()
  @Column({ name: 'datetime', type: 'timestamp' })
  public datetime: any;
}
