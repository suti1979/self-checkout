import { DataSource } from 'typeorm';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

export const config: SqliteConnectionOptions = {
  type: 'sqlite',
  database: 'db-self-checkout.sqlite',
  entities: ['dist/**/*.entity.js'],
  synchronize: true, // FALSE in production!!
  logging: true,
  logger: 'file',
  migrations: ['dist/db/migrations/*.js'],
};

const dataSource = new DataSource(config);
export default dataSource;
