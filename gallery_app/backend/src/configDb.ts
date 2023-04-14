import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
config();
import { User } from './user/entities/user.entity';
import { Photo } from './entity/photo.entity';
export const dbConfig = TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'p0s7gr3s',
  database: 'photo_db',
  synchronize: false,
  entities: [User, Photo],
  keepConnectionAlive: true,
});
