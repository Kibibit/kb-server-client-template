import { terminalConsoleLogo } from '@kibibit/consologo';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { AppModule } from './app.module';
import { KbNotFoundExceptionFilter } from './kb-not-found-exception.filter';
import { Swagger } from './swagger';

export async function bootstrap(): Promise<NestExpressApplication> {
  terminalConsoleLogo('kibibit server template', [
    'change this in server/src/main.ts'
  ]);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new KbNotFoundExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '../client'));

  await Swagger.addSwagger(app);

  return app;
}
