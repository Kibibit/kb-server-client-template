import { terminalConsoleLogo } from '@kibibit/consologo';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { AppModule, AppService } from '@kb-app';
import { KbNotFoundExceptionFilter } from '@kb-filters';

import { Swagger } from './swagger';

const appRoot = new AppService().appRoot;

export async function bootstrap(): Promise<NestExpressApplication> {
  terminalConsoleLogo('kibibit server template', [
    'change this in server/src/main.ts'
  ]);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new KbNotFoundExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(appRoot, './dist/client'));

  await Swagger.addSwagger(app);

  return app;
}
