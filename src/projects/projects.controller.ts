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
import {
  PaginationQueryDto,
  PaginationResponseDto,
} from 'src/common/models/dto/pagination';
import { CreateProjectDto, ProjectResponseDto, UpdateProjectDto } from './dto';
import { ProjectsService } from './projects.service';
import { plainToInstance } from 'class-transformer';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async getProjects(
    @Query() paginationDto: PaginationQueryDto,
  ): Promise<PaginationResponseDto<ProjectResponseDto>> {
    const projects = await this.projectsService.getProjects(paginationDto);

    return projects.toDto(ProjectResponseDto);
  }

  @Get(':id')
  async getProjectById(@Param('id') id: string): Promise<ProjectResponseDto> {
    const result = await this.projectsService.getProjectById(id);

    return plainToInstance(ProjectResponseDto, result);
  }

  @Post()
  async createProject(
    @Body() project: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    const result = await this.projectsService.createProject(project);

    return plainToInstance(ProjectResponseDto, result);
  }

  @Put(':id')
  async updateProject(
    @Param('id') id: string,
    @Body() project: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    const result = await this.projectsService.updateProject(id, project);

    return plainToInstance(ProjectResponseDto, result);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProject(@Param('id') id: string): Promise<void> {
    await this.projectsService.deleteProject(id);
  }
}
