import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { Base } from './BaseEntity';
import { IsPhoneNumber } from 'class-validator';
import { Vehicle } from './Vehicle.entity';
import { Invoice } from './Invoice.entity';

@Entity()
export class Client extends Base {
  @Property()
  name!: string;

  @Property()
  lastName!: string;

  @Property()
  address!: string;

  @Property({ unique: true })
  identificationCard!: string;

  @IsPhoneNumber()
  @Property()
  phone!: string;

  @OneToMany({ entity: () => Vehicle, mappedBy: 'client', orphanRemoval: true })
  vehicles = new Collection<Vehicle>(this);

  @OneToMany({
    entity: () => Invoice,
    mappedBy: 'client',
    orphanRemoval: true,
  })
  invoices = new Collection<Invoice>(this);
}
