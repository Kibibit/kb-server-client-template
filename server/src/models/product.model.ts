import { prop as PersistInDb } from '@typegoose/typegoose';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { BaseModel } from '../abstracts/base.model.abstract';

@Exclude()
export class Product extends BaseModel {
  
  @Expose()
  @IsNotEmpty()
  @PersistInDb()
  name: string;

  @Expose()
  @PersistInDb()
  description: string;
  
  @Expose()
  @IsNotEmpty()
  @PersistInDb()
  price: number;

  constructor(partial: Partial<Product> = {}) {
    super();
    Object.assign(this, partial);
  }
}
