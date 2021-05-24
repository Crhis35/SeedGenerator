import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core';
import { Base } from './BaseEntity';
import { Service } from './Service.entity';

@Entity()
export class Employee extends Base {
  @Property()
  name!: string;

  @Property()
  lastName!: string;

  @Property({ unique: true })
  identificationCard!: string;

  @Property()
  degree!: string;

  @Property()
  phone!: string;

  @Property({ type: 'number' })
  salaryByHour!: number;

  @ManyToMany(() => Service, (service) => service.mainTech)
  leader = new Collection<Service>(this);

  @ManyToMany(() => Service, (service) => service.helpersTech)
  helper = new Collection<Service>(this);
}
