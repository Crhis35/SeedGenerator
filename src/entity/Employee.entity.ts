import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { Base } from './BaseEntity';
import { HelperTech } from './HelperTech.entity';
import { MainTech } from './MainTech.entity';

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

  @Property({ columnType: 'decimal(10, 2)' })
  salaryByHour!: number;

  // @ManyToMany(() => Service, (service) => service.mainTech)
  // leader = new Collection<Service>(this);

  // @ManyToMany(() => Service, (service) => service.helpersTech)
  // helper = new Collection<Service>(this);

  @OneToMany({
    entity: () => MainTech,
    mappedBy: 'employee',
    orphanRemoval: true,
  })
  leader = new Collection<MainTech>(this);

  @OneToMany({
    entity: () => HelperTech,
    mappedBy: 'employee',
    orphanRemoval: true,
  })
  helper = new Collection<HelperTech>(this);
}
