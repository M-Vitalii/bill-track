import { Column, Entity } from 'typeorm';
import { AuditableEntity } from './auditable.entity';

@Entity()
export class User extends AuditableEntity {
  @Column()
  email: string;

  @Column()
  password: string;
}
