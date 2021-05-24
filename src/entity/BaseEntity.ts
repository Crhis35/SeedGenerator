import { Entity, Property, BaseEntity, PrimaryKey } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity({ abstract: true })
export class Base extends BaseEntity<Base, 'id'> {
  @PrimaryKey()
  id: string = v4();

  @Property({ default: true })
  active!: Boolean;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
