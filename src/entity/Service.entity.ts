import {
  ArrayType,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { Base } from './BaseEntity';
import { Employee } from './Employee.entity';
import { HelperTech } from './HelperTech.entity';
import { Invoice } from './Invoice.entity';
import { MainTech } from './MainTech.entity';
import { Section } from './Section.entity';
import { Vehicle } from './Vehicle.entity';

@Entity()
export class Service extends Base {
  @ManyToOne(() => Section)
  section!: Section;

  @ManyToOne(() => Invoice)
  invoice!: Invoice;

  @Property({ type: ArrayType, nullable: true })
  anotations?: string[];

  @Property()
  inDate!: Date;

  @Property()
  outDate!: Date;

  @ManyToOne(() => Vehicle)
  vehicle!: Vehicle;

  // @ManyToMany(() => Employee, (employee) => employee.leader, { owner: true })
  // mainTech = new Collection<Employee>(this);

  // @ManyToMany(() => Employee, (employee) => employee.helper, { owner: true })
  // helpersTech = new Collection<Employee>(this);

  @OneToMany({
    entity: () => MainTech,
    mappedBy: 'service',
    orphanRemoval: true,
  })
  mainTech = new Collection<MainTech>(this);

  @OneToMany({
    entity: () => HelperTech,
    mappedBy: 'service',
    orphanRemoval: true,
  })
  helpersTech = new Collection<HelperTech>(this);

  @Property({ columnType: 'decimal(10, 2)' })
  price!: number;
}
