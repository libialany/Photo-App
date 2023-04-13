import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();
import { Photo } from 'src/entity/photo.entity';
import { User } from 'src/user/entities/user.entity';
const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: true,
  entities: [Photo, User],
  migrations: ['database/migrations/*.ts'],
});

export default AppDataSource;
