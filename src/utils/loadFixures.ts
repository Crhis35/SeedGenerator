import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';

import * as faker from 'faker/locale/es';
import { Client } from '../entity/Client.entity';
import { Employee } from '../entity/Employee.entity';
import { Invoice } from '../entity/Invoice.entity';
import { Section } from '../entity/Section.entity';
import { Service } from '../entity/Service.entity';
import { Vehicle } from '../entity/Vehicle.entity';

const NUM = 150;

const sec = ['TALLER', 'SERVITECA'];
const servOpt = [
  'SMM',
  'SMF',
  'SME',
  'SMR',
  'SMA',
  'SLP',
  'LG',
  'LM',
  'LB',
  'PG',
  'G',
  'CA',
  'AB',
  'LMD',
  'RR',
];

export const loadFixtures = async (
  orm: MikroORM<IDatabaseDriver<Connection>>
): Promise<void> => {
  try {
    const sections = await Promise.all(
      [...Array(servOpt.length)].map(async (_, idx) => {
        let name = '';
        if (idx <= 5) {
          name = sec[0];
        } else {
          name = sec[1];
        }
        const section = orm.em.getRepository(Section).create({
          name,
          type: servOpt[idx],
        });

        await orm.em.persist(section);
        return section;
      })
    );
    const employees = await Promise.all(
      [...Array(NUM)].map(async () => {
        const employee = orm.em.getRepository(Employee).create({
          name: faker.name.firstName(),
          lastName: faker.name.lastName(),
          address: faker.address.streetAddress(),
          phone: faker.phone.phoneNumber(),
          degree: faker.name.jobTitle(),
          identificationCard: ~~(
            Math.random() * (99999999 - 10000000) +
            10000000
          ),
          salaryByHour: ~~(Math.random() * (100 - 1) + 1),
        });

        await orm.em.persist(employee);
        return employee;
      })
    );
    const clients = await Promise.all(
      [...Array(NUM)].map(async () => {
        const client = orm.em.getRepository(Client).create({
          name: faker.name.firstName(),
          lastName: faker.name.lastName(),
          address: faker.address.streetAddress(),
          phone: faker.phone.phoneNumber(),
          identificationCard: ~~(
            Math.random() * (99999999 - 10000000) +
            10000000
          ),
        });

        await orm.em.persist(client);
        return client;
      })
    );

    const vehicles = await Promise.all(
      [...Array(NUM)].map(async (_, idx) => {
        const vehicle = orm.em.getRepository(Vehicle).create({
          model: faker.vehicle.model(),
          color: faker.vehicle.color(),
          client: clients[idx].id,
          licensePlate: faker.vehicle.vrm(),
          brand: faker.vehicle.manufacturer(),
        });

        clients[idx].vehicles.add(vehicle);
        await orm.em.persist(vehicle);
        return vehicle;
      })
    );

    const invoices = await Promise.all(
      [...Array(NUM)].map(async (_, idx) => {
        const inovice = orm.em.getRepository(Invoice).create({
          client: clients[idx].id,
          date: faker.date.soon(),
        });

        await orm.em.persist(inovice);
        return inovice;
      })
    );

    await Promise.all(
      [...Array(NUM)].map(async (_, idx) => {
        const helper = ~~(Math.random() * 4);
        const main = ~~(Math.random() * 4);
        const anotations: string[] = [];
        const num = ~~(Math.random() * 4 + 1);
        for (let i = 0; i < num; i++) {
          anotations.push(faker.lorem.sentence(35));
        }
        const service = orm.em.getRepository(Service).create({
          helpersTech: employees[helper].id,
          section: sections[~~(Math.random() * servOpt.length)].id,
          client: clients[idx].id,
          vehicle: vehicles[idx].id,
          mainTech: employees[main].id,
          price: ~~(Math.random() * 1000000 + 120000),
          inDate: faker.date.recent(),
          outDate: faker.date.soon(),
          invoice: invoices[idx].id,
          anotations,
        });

        invoices[idx].service.add(service);
        invoices[idx].assign({ totalValue: service.price });
        vehicles[idx].service.add(service);
        employees[helper].helper.add(service);
        employees[main].leader.add(service);

        await orm.em.persist(service);
        return service;
      })
    );

    await orm.em.flush();
  } catch (error) {
    console.error('📌 Could not load fixtures', error);
  }
};
