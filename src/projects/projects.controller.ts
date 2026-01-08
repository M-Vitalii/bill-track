import {
  Body,
  Controller,
  Delete,
  Get,
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

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async getProjects(
    @Query() paginationDto: PaginationQueryDto,
  ): Promise<PaginationResponseDto<ProjectResponseDto>> {
    return this.projectsService.getProjects(paginationDto);
  }

  @Get(':id')
  async getProjectById(@Param('id') id: string): Promise<ProjectResponseDto> {
    return this.projectsService.getProjectById(id);
  }

  @Post()
  async createProject(
    @Body() project: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.createProject(project);
  }

  @Put(':id')
  async updateProject(
    @Param('id') id: string,
    @Body() project: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.updateProject(id, project);
  }

  @Delete(':id')
  async deleteProject(@Param('id') id: string): Promise<void> {
    await this.projectsService.deleteProject(id);
  }
}
