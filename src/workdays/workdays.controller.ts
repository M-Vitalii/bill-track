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
import { CreateWorkdayDto, UpdateWorkdayDto, WorkdayResponseDto } from './dto';
import { WorkdaysService } from './workdays.service';
import { GetWorkdaysQueryDto } from './dto/get-workdays-query.dto';

@Controller('workdays')
export class WorkdaysController {
  constructor(private readonly workdaysService: WorkdaysService) {}

  @Get()
  async getWorkdays(
    @Query() paginationDto: PaginationQueryDto,
  ): Promise<PaginationResponseDto<WorkdayResponseDto>> {
    const workdays = await this.workdaysService.getWorkdays(paginationDto);

    return workdays.toDto(WorkdayResponseDto);
  }

  @Get(':id')
  async getWorkdayById(@Param('id') id: string): Promise<WorkdayResponseDto> {
    const result = await this.workdaysService.getWorkdayById(id);

    return plainToInstance(WorkdayResponseDto, result);
  }

  @Get('employee/:employeeId')
  async getWorkdaysByEmployeeId(
    @Param('employeeId') employeeId: string,
    @Query() paginationDto: GetWorkdaysQueryDto,
  ): Promise<PaginationResponseDto<WorkdayResponseDto>> {
    const workdays = await this.workdaysService.getWorkdaysByEmployeeId(
      employeeId,
      paginationDto,
    );

    return workdays.toDto(WorkdayResponseDto);
  }

  @Post()
  async createWorkday(
    @Body() workday: CreateWorkdayDto,
  ): Promise<WorkdayResponseDto> {
    const result = await this.workdaysService.createWorkday(workday);

    return plainToInstance(WorkdayResponseDto, result);
  }

  @Put(':id')
  async updateWorkday(
    @Param('id') id: string,
    @Body() workday: UpdateWorkdayDto,
  ): Promise<WorkdayResponseDto> {
    const result = await this.workdaysService.updateWorkday(id, workday);

    return plainToInstance(WorkdayResponseDto, result);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteWorkday(@Param('id') id: string): Promise<void> {
    await this.workdaysService.deleteWorkday(id);
  }
}
