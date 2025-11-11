import { Column, Entity, OneToMany } from 'typeorm';
import { AuditableEntity } from './auditable.entity';
import { Employee } from './employee.entity';

@Entity()
export class Department extends AuditableEntity {
  @Column()
  name: string;

  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[];
}
