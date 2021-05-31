import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';

import * as faker from 'faker/locale/es';
import { serialize } from 'v8';
import { Client } from '../entity/Client.entity';
import { Employee } from '../entity/Employee.entity';
import { HelperTech } from '../entity/HelperTech.entity';
import { Invoice } from '../entity/Invoice.entity';
import { MainTech } from '../entity/MainTech.entity';
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
const mains = [
  60, 134, 138, 1, 44, 133, 149, 76, 57, 63, 93, 35, 126, 82, 68, 127, 115, 147,
  15, 33, 18, 67, 3, 51, 9, 83, 17, 8, 73, 84, 55, 94, 26, 114, 45, 96, 139, 27,
  128, 11, 75, 19, 5, 80, 129, 31, 125, 42, 141, 101, 95, 52, 106, 90, 2, 130,
  113, 120, 116, 47, 145, 13, 58, 77, 62, 102, 41, 87, 6, 48, 108, 124, 29, 122,
  72, 78, 118, 117, 20, 131, 59, 61, 30, 81, 88, 89, 74, 107, 71, 22, 50, 110,
  43, 98, 14, 16, 36, 25, 142, 137, 28, 103, 23, 7, 99, 91, 104, 0, 146, 143,
  46, 56, 39, 4, 119, 132, 92, 97, 65, 24, 10, 38, 79, 85, 12, 105, 34, 123,
  100, 148, 64, 32, 144, 121, 40, 37, 135, 140, 136, 69, 112, 49, 66, 70, 86,
  109, 54, 111, 53, 21,
];

const helpers = [
  59, 13, 44, 66, 38, 107, 15, 46, 70, 85, 118, 73, 100, 143, 41, 40, 24, 23,
  43, 90, 6, 52, 148, 48, 129, 133, 136, 132, 22, 64, 72, 116, 49, 75, 126, 108,
  76, 89, 2, 87, 113, 29, 98, 31, 101, 32, 79, 0, 14, 127, 91, 68, 3, 36, 45,
  16, 67, 65, 61, 17, 140, 144, 122, 125, 105, 4, 80, 117, 120, 7, 119, 104, 57,
  95, 25, 92, 111, 141, 102, 146, 26, 83, 82, 37, 78, 35, 77, 123, 121, 93, 74,
  124, 55, 115, 62, 94, 60, 110, 20, 8, 131, 50, 58, 39, 103, 71, 128, 138, 114,
  106, 109, 30, 99, 63, 53, 145, 21, 51, 47, 56, 5, 18, 88, 9, 12, 137, 96, 27,
  142, 139, 147, 97, 69, 11, 19, 1, 42, 81, 86, 84, 149, 34, 130, 112, 28, 33,
  54, 134, 10, 135,
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

    const services = await Promise.all(
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

        await orm.em.persist(service);
        return service;
      })
    );

    await Promise.all(
      [...Array(NUM)].map(async (_, idx) => {
        const mainTech = orm.em.getRepository(MainTech).create({
          employee: employees[mains[idx]].id,
          service: services[mains[idx]].id,
          workedHours: ~~(Math.random() * 24 + 1),
          startDate: faker.date.recent(),
          endDate: faker.date.soon(),
        });

        await orm.em.persist(mainTech);
        return mainTech;
      })
    );

    await Promise.all(
      [...Array(NUM)].map(async (_, idx) => {
        const helpersTech = orm.em.getRepository(HelperTech).create({
          employee: employees[helpers[idx]].id,
          service: services[helpers[idx]].id,
          workedHours: ~~(Math.random() * 24 + 1),
          startDate: faker.date.recent(),
          endDate: faker.date.soon(),
        });

        await orm.em.persist(helpersTech);
        return helpersTech;
      })
    );

    await orm.em.flush();
  } catch (error) {
    console.error('📌 Could not load fixtures', error);
  }
};
