import { Column, Entity, OneToMany } from 'typeorm';
import { Employee } from './employee.entity';
import { AuditableEntity } from './auditable.entity';

@Entity()
export class Project extends AuditableEntity {
  @Column()
  name: string;

  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[];
}
