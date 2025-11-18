import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [`${__dirname}/entities/**.entity.{js,ts}`],
  migrations: [`${__dirname}/migrations/**.{js,ts}`],
  migrationsTableName: 'migrations',
  extra: {
    max: process.env.DB_MAX_POOL_SIZE,
    min: process.env.DB_MIN_POOL_SIZE,
  },
});
