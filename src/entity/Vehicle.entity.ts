import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
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

  @OneToMany({
    entity: () => Service,
    mappedBy: 'vehicle',
    orphanRemoval: true,
  })
  service = new Collection<Service>(this);
}
