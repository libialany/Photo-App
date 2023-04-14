import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
config();
import { User } from './user/entities/user.entity';
import { Photo } from './entity/photo.entity';
export const dbConfig = TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Photo],
  synchronize: false,
});
