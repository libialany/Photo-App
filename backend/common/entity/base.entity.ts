import { BaseEntity, Column } from 'typeorm';

export abstract class AppBaseEntity extends BaseEntity {
  @Column({
    name: '_estado',
    length: 30,
    type: 'varchar',
    nullable: false,
  })
  estado: string;

  protected constructor(data?: Partial<AppBaseEntity>) {
    super();
    if (data) Object.assign(this, data);
  }
}
