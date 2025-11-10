import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  deletedAt: Date;

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
