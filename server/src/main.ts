import { terminalConsoleLogo } from '@kibibit/consologo';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import axios from 'axios';
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

  const config = new DocumentBuilder()
    .setTitle('API Docs example')
    .setDescription('The API description')
    .setVersion('1.0')
    .setContact(
      'thatkookooguy',
      'github.com/thatkookooguy',
      'thatkookooguy@kibibit.io'
    )
    .addTag(
      'product',
      [
        'Product is an example module to show how to ',
        'add **swagger** documentation'
      ].join(''),
      {
        url: 'https://github.com/kibibit',
        description: 'See Docs'
      }
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const swaggerCssResponse = await axios
    .get('https://kibibit.io/kibibit-assets/swagger/swagger.css');
  const customCss = swaggerCssResponse.data;
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: `kibibit - API documentation`,
    customCss,
    customJs: '//kibibit.io/kibibit-assets/swagger/swagger.js',
    swaggerOptions: {
      docExpansion: 'none',
      apisSorter: "alpha", // can also be a function
      operationsSorter: (a, b) => {
        const methodsOrder = [
          "get",
          "post",
          "put",
          "patch",
          "delete",
          "options",
          "trace"
        ];
        let result =
          methodsOrder.indexOf( a.get("method") ) -
          methodsOrder.indexOf( b.get("method") );
        // Or if you want to sort the methods alphabetically (delete, get, head, options, ...):
        // var result = a.get("method").localeCompare(b.get("method"));
  
        if (result === 0) {
          result = a.get("path").localeCompare(b.get("path"));
        }
  
        return result;
      }
    }
  });

  await app.listen(10102);
}
bootstrap();
