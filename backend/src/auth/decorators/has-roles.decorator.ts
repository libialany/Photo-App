import { SetMetadata } from '@nestjs/common';
import { Role } from '../model/roles.enum';

export const HasRoles = (...roles: Role[]) => SetMetadata('rol', roles);
