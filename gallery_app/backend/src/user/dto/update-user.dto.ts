import { Role } from 'src/auth/model/roles.enum';

export class UpdateUserDto {
  userId: string;
  username: string;
  password: string;
  rol: Role;
  refreshToken: string;
}
