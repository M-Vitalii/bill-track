import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaginationQueryDto,
  PaginationResponseDto,
} from 'src/common/models/dto/pagination';
import { paginate } from 'src/common/utils/pagination';
import { Department } from 'src/database/entities';
import { Repository } from 'typeorm';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentsRepository: Repository<Department>,
  ) {}

  async createDepartment(dto: CreateDepartmentDto): Promise<Department> {
    try {
      const department = this.departmentsRepository.create(dto);
      return this.departmentsRepository.save(department);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to create department');
    }
  }

  async getDepartmentById(id: string): Promise<Department> {
    const department = await this.departmentsRepository.findOneBy({ id });
    if (!department) throw new NotFoundException('Department not found');

    return department;
  }

  async getDepartments(
    paginationDto: PaginationQueryDto,
  ): Promise<PaginationResponseDto<Department>> {
    return await paginate(this.departmentsRepository, paginationDto);
  }

  async deleteDepartment(id: string): Promise<void> {
    const department = await this.departmentsRepository.findOneBy({ id });
    if (!department) throw new NotFoundException('Department not found');

    try {
      await this.departmentsRepository.softDelete(id);
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Failed to delete department');
    }
  }

  async updateDepartment(
    id: string,
    dto: UpdateDepartmentDto,
  ): Promise<Department> {
    const existing = await this.departmentsRepository.findOneBy({ id });
    if (!existing) throw new NotFoundException('Department not found');

    try {
      const updated = this.departmentsRepository.merge(existing, dto);
      return this.departmentsRepository.save(updated);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to update department');
    }
  }
}
