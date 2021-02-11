import { terminalConsoleLogo } from '@kibibit/consologo';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { AppModule } from './app.module';
import { KbNotFoundExceptionFilter } from './kb-not-found-exception.filter';

async function bootstrap() {
  terminalConsoleLogo('kibibit server template', [
    'change this in server/src/main.ts'
  ]);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new KbNotFoundExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '../client'));
  await app.listen(10102);
}
bootstrap();
