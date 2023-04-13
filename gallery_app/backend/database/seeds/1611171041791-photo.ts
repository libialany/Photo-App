import { Photo } from 'src/entity/photo.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
export class photo1611171041790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        title: 'img1',
        url: 'img1',
        description: 'img1',
      },
    ];
    for (const item of items) {
      const photo = new Photo(item.title, item.url, item.description);
      await queryRunner.manager.save(photo);
    }
  }

  /* eslint-disable */
    public async down(queryRunner: QueryRunner): Promise<void> { }
}