import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { Base } from './BaseEntity';
import { Client } from './Client.entity';
import { Service } from './Service.entity';

@Entity()
export class Vehicle extends Base {
  @Property()
  model!: string;

  @Property()
  licensePlate!: string;

  @Property()
  color!: string;

  @Property()
  brand!: string;

  @ManyToOne(() => Client)
  client!: Client;

  @ManyToMany(() => Service, (service) => service.vehicle)
  service = new Collection<Service>(this);
}
