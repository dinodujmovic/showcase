import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { PostModule } from './post/post.module';
import { AppLogger } from './app.logger';
import { config } from '../config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: config.database.type,
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.database,
      entities: [
        ...UserModule.entities,
        ...RoleModule.entities,
        ...PostModule.entities,
      ],
      synchronize: false,
    }),
    AuthModule,
    UserModule,
    RoleModule,
    PostModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {
  private logger = new AppLogger(AppModule.name);

  constructor(private readonly connection: Connection) {
    this.logger.log('Initialize Showcase App Service!');
    this.logger.log(`Is DB Connected: ${this.connection.isConnected}`);
  }
}
