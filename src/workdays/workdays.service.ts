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
import { Employee, Workday } from 'src/database/entities';
import { Between, FindOptionsWhere, Not, Repository } from 'typeorm';
import { CreateWorkdayDto, UpdateWorkdayDto } from './dto';
import { GetWorkdaysQueryDto } from './dto/get-workdays-query.dto';

@Injectable()
export class WorkdaysService {
  constructor(
    @InjectRepository(Workday)
    private readonly workdaysRepository: Repository<Workday>,
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
  ) {}

  async createWorkday(dto: CreateWorkdayDto): Promise<Workday> {
    const employee = await this.employeesRepository.findOneBy({
      id: dto.employeeId,
    });
    if (!employee) throw new NotFoundException('Employee not found');

    const startOfDay = new Date(dto.date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(dto.date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingWorkday = await this.workdaysRepository.findOne({
      where: {
        employee: { id: dto.employeeId },
        date: Between(startOfDay, endOfDay),
      },
    });

    if (existingWorkday) {
      throw new BadRequestException(
        'Workday already exists for this employee on this date.',
      );
    }

    try {
      const workday = this.workdaysRepository.create({ ...dto, employee });
      return this.workdaysRepository.save(workday);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to create workday');
    }
  }

  async getWorkdayById(id: string): Promise<Workday> {
    const workday = await this.workdaysRepository.findOne({
      where: { id },
      relations: ['employee'],
    });
    if (!workday) throw new NotFoundException('Workday not found');

    return workday;
  }

  async getWorkdays(
    paginationDto: PaginationQueryDto,
  ): Promise<PaginationResponseDto<Workday>> {
    return await paginate(this.workdaysRepository, paginationDto, {
      relations: ['employee'],
    });
  }

  async getWorkdaysByEmployeeId(
    employeeId: string,
    query: GetWorkdaysQueryDto,
  ): Promise<PaginationResponseDto<Workday>> {
    const { startDate, endDate, ...paginationDto } = query;
    const where: FindOptionsWhere<Workday> = { employee: { id: employeeId } };

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        throw new BadRequestException('endDate cannot be before startDate.');
      }
      where.date = Between(start, end);
    } else if (startDate || endDate) {
      throw new BadRequestException(
        'Both startDate and endDate must be provided for date range filtering.',
      );
    }

    return await paginate(this.workdaysRepository, paginationDto, {
      where,
      relations: ['employee'],
    });
  }

  async deleteWorkday(id: string): Promise<void> {
    const workday = await this.workdaysRepository.findOneBy({ id });
    if (!workday) throw new NotFoundException('Workday not found');

    try {
      await this.workdaysRepository.softDelete(id);
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Failed to delete workday');
    }
  }

  async updateWorkday(id: string, dto: UpdateWorkdayDto): Promise<Workday> {
    const existing = await this.workdaysRepository.findOneBy({ id });
    if (!existing) throw new NotFoundException('Workday not found');

    const employee = await this.employeesRepository.findOneBy({
      id: dto.employeeId,
    });
    if (!employee) throw new NotFoundException('Employee not found');

    if (dto.date) {
      const startOfDay = new Date(dto.date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(dto.date);
      endOfDay.setHours(23, 59, 59, 999);

      const existingWorkday = await this.workdaysRepository.findOne({
        where: {
          id: Not(id),
          employee: { id: dto.employeeId },
          date: Between(startOfDay, endOfDay),
        },
      });

      if (existingWorkday) {
        throw new BadRequestException(
          'Workday already exists for this employee on this date.',
        );
      }
    }

    try {
      const updated = this.workdaysRepository.merge(existing, {
        ...dto,
        employee,
      });
      return this.workdaysRepository.save(updated);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to update workday');
    }
  }
}
