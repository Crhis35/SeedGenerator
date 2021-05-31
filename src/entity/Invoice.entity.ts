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
export class Invoice extends Base {
  @OneToMany(() => Service, (service) => service.invoice)
  service = new Collection<Service>(this);

  @ManyToOne(() => Client)
  client!: Client;

  @Property()
  date!: Date;

  @Property({ columnType: 'decimal(10, 2)' })
  totalValue!: number;
}
