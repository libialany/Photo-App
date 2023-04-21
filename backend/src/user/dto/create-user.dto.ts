import { Role } from 'src/auth/model/roles.enum';

export class CreateUserDto {
  userId: string;
  name: string;
  username: string;
  password: string;
  rol: Role;
  refreshToken: string;
}
