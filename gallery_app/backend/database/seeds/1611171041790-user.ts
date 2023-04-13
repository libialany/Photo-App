import { User } from 'src/user/entities/user.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
export class user1611171041790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        name: 'user3',
        username: '123user3',
        password: 'user3',
      },
    ];
    for (const item of items) {
      const photo = new User(item.name, item.username, item.password);
      await queryRunner.manager.save(photo);
    }
  }

  /* eslint-disable */
    public async down(queryRunner: QueryRunner): Promise<void> { }
}