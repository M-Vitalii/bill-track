import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  PaginationQueryDto,
  PaginationResponseDto,
} from 'src/common/models/dto/pagination';
import { DepartmentsService } from './departments.service';
import {
  CreateDepartmentDto,
  DepartmentResponseDto,
  UpdateDepartmentDto,
} from './dto';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  async getDepartments(
    @Query() paginationDto: PaginationQueryDto,
  ): Promise<PaginationResponseDto<DepartmentResponseDto>> {
    const departments =
      await this.departmentsService.getDepartments(paginationDto);

    return departments.toDto(DepartmentResponseDto);
  }

  @Get(':id')
  async getDepartmentById(
    @Param('id') id: string,
  ): Promise<DepartmentResponseDto> {
    const result = await this.departmentsService.getDepartmentById(id);

    return plainToInstance(DepartmentResponseDto, result);
  }

  @Post()
  async createDepartment(
    @Body() department: CreateDepartmentDto,
  ): Promise<DepartmentResponseDto> {
    const result = await this.departmentsService.createDepartment(department);

    return plainToInstance(DepartmentResponseDto, result);
  }

  @Put(':id')
  async updateDepartment(
    @Param('id') id: string,
    @Body() department: UpdateDepartmentDto,
  ): Promise<DepartmentResponseDto> {
    const result = await this.departmentsService.updateDepartment(
      id,
      department,
    );

    return plainToInstance(DepartmentResponseDto, result);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDepartment(@Param('id') id: string): Promise<void> {
    await this.departmentsService.deleteDepartment(id);
  }
}
