import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { AppBaseEntity } from '../../common/entity/base.entity';
@Entity()
export class Photo extends AppBaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  url: string;

  @Column()
  description: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp without time zone',
    nullable: false,
    default: () => 'now()',
  })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.photos, {
    nullable: true,
  })
  @JoinColumn({ name: 'id_user', referencedColumnName: 'id' })
  user: User;
  @Column({
    name: 'id_user',
    type: 'string',
    nullable: true,
  })
  idUser: string;
  constructor(data?: Partial<Photo>) {
    super(data);
  }
}
