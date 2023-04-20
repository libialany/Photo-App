import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();
const SeedDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: true,
  entities: ['src/entity/photo.entity.ts', 'src/user/entities/user.entity.ts'],
  migrations: ['database/seeds/*.ts'],
});

export default SeedDataSource;
