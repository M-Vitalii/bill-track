import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AuditableEntity } from './auditable.entity';
import { Department } from './department.entity';
import { Project } from './project.entity';
import { Workday } from './workday.entity';
import { Invoice } from './invoice.entity';

@Entity()
export class Employee extends AuditableEntity {
  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  salary: number;

  @Column({ nullable: true })
  departmentId: string | null;

  @Column({ nullable: true })
  projectId: string | null;

  @ManyToOne(() => Department, (department) => department.employees, {
    nullable: true,
  })
  department: Department | null;

  @ManyToOne(() => Project, (project) => project.employees, {
    nullable: true,
  })
  project: Project | null;

  @OneToMany(() => Workday, (workday) => workday.employee)
  workdays: Workday[];

  @OneToMany(() => Invoice, (invoice) => invoice.employee)
  invoices: Invoice[];
}
