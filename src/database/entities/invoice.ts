import { Column, Entity, ManyToOne } from 'typeorm';
import { Employee } from './employee';
import { AuditableEntity } from './auditable-entity';

@Entity()
export class Invoice extends AuditableEntity {
  @Column()
  month: number;

  @Column()
  year: number;

  @Column()
  employeeId: string;

  @Column()
  invoiceUrl: string;

  @ManyToOne(() => Employee, (employee) => employee.invoices)
  employee: Employee;
}
