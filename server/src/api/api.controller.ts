import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class ApiController {
  @Get()
  getAPI(): string {
    console.log('GET API!');
    return 'API';
  }
}
