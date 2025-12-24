import { Column, Entity } from 'typeorm';
import { AuditableEntity } from './auditable.entity';

@Entity()
export class User extends AuditableEntity {
  @Column()
  email: string;

  @Column()
  hashedPassword: string;

  @Column({ nullable: true })
  hashedRefreshToken?: string;

  constructor(partial?: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
