import { Entity, Property } from '@mikro-orm/core';
import { Base } from './BaseEntity';

@Entity()
export class Section extends Base {
  @Property()
  name!: string;

  @Property()
  type!: string;
}
