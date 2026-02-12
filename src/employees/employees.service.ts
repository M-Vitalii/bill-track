import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaginationQueryDto,
  PaginationResponseDto,
} from 'src/common/models/dto/pagination';
import { paginate } from 'src/common/utils/pagination/paginate.util';
import { Department, Employee, Project } from 'src/database/entities';
import { Repository } from 'typeorm';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async createEmployee(dto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.employeesRepository.create(dto);

    return this.employeesRepository.save(employee);
  }

  async getEmployeeById(id: string): Promise<Employee> {
    const employee = await this.employeesRepository.findOneBy({ id });

    if (!employee) throw new NotFoundException('Employee not found');

    return employee;
  }

  async getEmployees(
    paginationDto: PaginationQueryDto,
  ): Promise<PaginationResponseDto<Employee>> {
    return await paginate(this.employeesRepository, paginationDto);
  }

  async deleteEmployee(id: string): Promise<void> {
    const result = await this.employeesRepository.softDelete(id);

    if (!result.affected) throw new NotFoundException();
  }

  async updateEmployee(
    id: string,
    employee: UpdateEmployeeDto,
  ): Promise<Employee> {
    const existingEmployee = await this.getEmployeeById(id);

    const updatedEmployee = this.employeesRepository.merge(
      existingEmployee,
      employee,
    );

    return this.employeesRepository.save(updatedEmployee);
  }

  async addEmployeeToDepartment(
    employeeId: string,
    departmentId: string,
  ): Promise<Employee> {
    const employee = await this.getEmployeeById(employeeId);
    const department = await this.departmentRepository.findOneBy({
      id: departmentId,
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    employee.department = department;

    return this.employeesRepository.save(employee);
  }

  async removeEmployeeFromDepartment(employeeId: string): Promise<Employee> {
    const employee = await this.getEmployeeById(employeeId);

    employee.department = null;
    employee.departmentId = null;

    return this.employeesRepository.save(employee);
  }

  async addEmployeeToProject(
    employeeId: string,
    projectId: string,
  ): Promise<Employee> {
    const employee = await this.getEmployeeById(employeeId);
    const project = await this.projectRepository.findOneBy({ id: projectId });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    employee.project = project;

    return this.employeesRepository.save(employee);
  }

  async removeEmployeeFromProject(employeeId: string): Promise<Employee> {
    const employee = await this.getEmployeeById(employeeId);

    employee.project = null;
    employee.projectId = null;

    return this.employeesRepository.save(employee);
  }
}
