import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class PublicError {
  @ApiProperty()
  statusCode: HttpStatus;

  // toISOString formatted Date
  @ApiProperty()
  timestamp: string;
  
  @ApiProperty()
  path: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  error: string | string[];

  constructor(partial: Partial<PublicError> = {}) {
    Object.assign(this, partial);
  }
}
