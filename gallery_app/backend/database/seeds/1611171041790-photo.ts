import { Photo } from 'src/entity/photo.entity';
import { User } from 'src/user/entities/user.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
export class photo1611171041790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const user = new User();
    user.name = 'maria';
    user.username = 'mar';
    user.password =
      '$argon2id$v=19$m=65536,t=3,p=4$1zIMMQnIya+23Qm4YH2m0g$T3QmxT83TbhFDrs4gpCE7OM7llhYV1xQTMw0Cs9I0yA';
    user.estado = 'ACTIVO';
    await queryRunner.manager.save(user);
    const photoItems = [
      {
        id: '1',
        title: 'photo1',
        url: 'http://photo1',
        description: 'photo1 descripcion',
      },
      {
        id: '2',
        title: 'photo2',
        url: 'http://photo2',
        description: 'photo2 descripcion',
      },
    ];
    const photos = photoItems.map((item) => {
      return new Photo({
        title: item.title,
        idUser: '1',
        estado: 'ACTIVO',
        url: item.url,
        description: item.description,
      });
    });
    await queryRunner.manager.save(photos);
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> { }
}