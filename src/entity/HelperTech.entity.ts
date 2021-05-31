import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Base } from './BaseEntity';
import { Employee } from './Employee.entity';
import { Service } from './Service.entity';

@Entity()
export class HelperTech extends Base {
  @ManyToOne(() => Service)
  service!: Service;

  @ManyToOne(() => Employee)
  employee!: Employee;

  @Property()
  workedHours!: string;

  @Property()
  startDate!: Date;

  @Property()
  endDate!: Date;
}
