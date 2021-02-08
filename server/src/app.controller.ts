import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

import { AppService } from './app.service';

@Controller()
export class AppController {
  appRoot = join(__dirname, '../../');
  constructor(private readonly appService: AppService) {}

  @Get()
  sendApplication(@Res() res: Response): void {
    res.sendFile(join(this.appRoot, 'dist/client/index.html'));
  }

  @Get('/api')
  getHello(): string {
    return this.appService.getHello();
  }
}
