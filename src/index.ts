import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import ormConfig from './orm.config';
import { loadFixtures } from './utils/loadFixures';
import { Client } from './entity/Client.entity';

const startApp = async () => {
  try {
    const orm = await MikroORM.init({
      ...ormConfig,
      findOneOrFailHandler: (entityName: string) => {
        return new Error(`${entityName} not found!`);
      },
    });
    await loadFixtures(orm);

    // const client = await orm.em
    //   .getRepository(Client)
    //   .findOne({ id: '025e5e8e-4e7c-455e-aec4-bd383e7a5e68' }, [
    //     'services',
    //     'vehicles',
    //   ]);
    // const services = client?.services.getItems();
    // console.log(client);

    // if (services) {
    //   await services[0].vehicle.init();
    //   console.log(services[0].anotations);
    //   console.log(services[0].vehicle.getItems());
    // }

    console.log('Success');
  } catch (error) {
    console.log(error);
  }
};

startApp();
