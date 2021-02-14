import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { readJSON } from 'fs-extra';
import { chain } from 'lodash';
import { join } from 'path';

import { ApiInfo } from '../models/api.model';

@Controller('api')
export class ApiController {
  appRoot = join(__dirname, '../../../');

  @Get()
  @ApiOperation({ summary: 'Get API Information' })
  @ApiOkResponse({
    description: 'Returns API info as a JSON',
    type: ApiInfo
  })
  async getAPI() {
    const packageInfo = await readJSON(join(this.appRoot, './package.json'));
    const details = new ApiInfo(
      chain(packageInfo)
      .pick([
        'name',
        'description',
        'version',
        'license',
        'repository',
        'author',
        'bugs'
      ])
      .mapValues((val) => val.url ? val.url : val)
      .value()
    );
    console.log('GET API!');
    return details;
  }

  @Get('/nana')
  @ApiOperation({
    deprecated: true
  })
  deprecationTest() {
    return 'hello';
  }
}
