import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  PaginationQueryDto,
  PaginationResponseDto,
} from 'src/common/models/dto/pagination';
import {
  CreateEmployeeDto,
  EmployeeResponseDto,
  UpdateEmployeeDto,
} from './dto';
import { EmployeesService } from './employees.service';
import { plainToInstance } from 'class-transformer';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  async getEmployees(
    @Query() paginationDto: PaginationQueryDto,
  ): Promise<PaginationResponseDto<EmployeeResponseDto>> {
    const employees = await this.employeesService.getEmployees(paginationDto);

    return employees.toDto(EmployeeResponseDto);
  }

  @Get(':id')
  async getEmployeeById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<EmployeeResponseDto> {
    const result = await this.employeesService.getEmployeeById(id);

    return plainToInstance(EmployeeResponseDto, result);
  }

  @Post()
  async createEmployee(
    @Body() employee: CreateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    const result = await this.employeesService.createEmployee(employee);

    return plainToInstance(EmployeeResponseDto, result);
  }

  @Put(':id')
  async updateEmployee(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() employee: UpdateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    const result = await this.employeesService.updateEmployee(id, employee);

    return plainToInstance(EmployeeResponseDto, result);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteEmployee(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.employeesService.deleteEmployee(id);
  }

  @Post(':id/departments/:departmentId')
  async addEmployeeToDepartment(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('departmentId', ParseUUIDPipe) departmentId: string,
  ): Promise<EmployeeResponseDto> {
    const result = await this.employeesService.addEmployeeToDepartment(
      id,
      departmentId,
    );

    return plainToInstance(EmployeeResponseDto, result);
  }

  @Delete(':id/department')
  async removeEmployeeFromDepartment(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<EmployeeResponseDto> {
    const result = await this.employeesService.removeEmployeeFromDepartment(id);

    return plainToInstance(EmployeeResponseDto, result);
  }

  @Post(':id/projects/:projectId')
  async addEmployeeToProject(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ): Promise<EmployeeResponseDto> {
    const result = await this.employeesService.addEmployeeToProject(
      id,
      projectId,
    );

    return plainToInstance(EmployeeResponseDto, result);
  }

  @Delete(':id/project')
  async removeEmployeeFromProject(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<EmployeeResponseDto> {
    const result = await this.employeesService.removeEmployeeFromProject(id);

    return plainToInstance(EmployeeResponseDto, result);
  }
}
