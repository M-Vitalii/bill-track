import { Column, Entity, ManyToOne } from 'typeorm';
import { AuditableEntity } from './auditable.entity';
import { Employee } from './employee.entity';

@Entity()
export class Workday extends AuditableEntity {
  @Column()
  date: Date;

  @Column()
  hours: number;

  @ManyToOne(() => Employee, (employee) => employee.workdays)
  employee: Employee;
}
