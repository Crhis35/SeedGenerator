import {
  ArrayType,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { Base } from './BaseEntity';
import { Employee } from './Employee.entity';
import { Invoice } from './Invoice.entity';
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

  @ManyToMany(() => Vehicle, (vehicle) => vehicle.service, { owner: true })
  vehicle = new Collection<Vehicle>(this);

  @ManyToMany(() => Employee, (employee) => employee.leader, { owner: true })
  mainTech = new Collection<Employee>(this);

  @ManyToMany(() => Employee, (employee) => employee.helper, { owner: true })
  helpersTech = new Collection<Employee>(this);

  @Property({ type: 'number' })
  price!: number;
}
