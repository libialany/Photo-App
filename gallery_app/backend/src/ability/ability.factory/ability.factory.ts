import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/dto/user-payload.dto';
import { Role } from 'src/auth/model/roles.enum';
import { Photo } from 'src/entity/photo.entity';
export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}
export type Subjects = InferSubjects<typeof Photo | typeof User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;
@Injectable()
export class AbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );
    if (user.roles.includes(Role.Admin)) {
      // CRU permission to ADMIN Users
      can(Action.Create, 'all');
      can(Action.Read, 'all');
      can(Action.Update, 'all');
    } else {
      // Read Permission to USER
      can(Action.Read, 'all');
    }

    // can(Action.Update, Article, { authorId: user.userId });
    // cannot(Action.Delete, Article, { isPublished: true });

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
  createForPhoto(user: User) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );
    if (user.roles.includes(Role.Admin) || user.roles.includes(Role.User)) {
      can(Action.Create, Photo);
    }
    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
  adminInfo(user: User) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );
    if (user.roles.includes(Role.Admin)) {
      can(Action.Read, Photo);
    }
    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
