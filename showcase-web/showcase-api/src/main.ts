import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { config } from '../config';
import { AppLogger } from './app.logger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new AppLogger('Nest'),
  });

  app.enableCors()
  // =============================
  //  Bind ValidationPipe at the application level (thus ensuring all endpoints are protected from receiving incorrect data)
  // =============================
  app.useGlobalPipes(new ValidationPipe());

  // =============================
  // Fix class-validator NestJS issue (https://github.com/nestjs/nest/issues/528#issuecomment-395338798)
  // =============================
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // =============================
  // Define static assets path
  // =============================
  app.useStaticAssets(
    config.assets.path,
    {
      prefix: config.assets.prefix,
    },
  );

  // =============================
  // Define Swagger
  // =============================
  const options = new DocumentBuilder()
    .setTitle(config.swagger.title)
    .setDescription(config.swagger.description)
    .setVersion(config.swagger.version)
    .addTag(config.swagger.tag)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(config.swagger.path, app, document);

  await app.listen(3000);
}

bootstrap();
