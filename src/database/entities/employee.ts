import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AuditableEntity } from './auditable-entity';
import { Department } from './department';
import { Project } from './project';
import { Workday } from './workday';
import { Invoice } from './invoice';

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

  @Column()
  departmentId: string;

  @Column()
  projectId: string;

  @ManyToOne(() => Department, (department) => department.employees)
  department: Department;

  @ManyToOne(() => Project, (project) => project.employees)
  project: Project;

  @OneToMany(() => Workday, (workday) => workday.employee)
  workdays: Workday[];

  @OneToMany(() => Invoice, (invoice) => invoice.employee)
  invoices: Invoice[];
}
