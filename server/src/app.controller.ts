import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  sendApplication(@Res() res: Response) {
    res.sendFile(join(__dirname, '../client/index.html'));
  }

  @Get('/api')
  getHello(): string {
    return this.appService.getHello();
  }
}
