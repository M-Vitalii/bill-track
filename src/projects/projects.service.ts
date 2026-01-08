import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'src/common/utils/pagination/paginate.util';
import { Project } from 'src/database/entities';
import { Repository } from 'typeorm';
import { CreateProjectDto, ProjectResponseDto, UpdateProjectDto } from './dto';
import {
  PaginationQueryDto,
  PaginationResponseDto,
} from 'src/common/models/dto/pagination';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
  ) {}

  async createProject(dto: CreateProjectDto): Promise<Project> {
    const project = this.projectsRepository.create(dto);

    return this.projectsRepository.save(project);
  }

  async getProjectById(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOneBy({ id });

    if (!project) throw new NotFoundException();

    return project;
  }

  async getProjects(
    paginationDto: PaginationQueryDto,
  ): Promise<PaginationResponseDto<ProjectResponseDto>> {
    const result = await paginate(this.projectsRepository, paginationDto);

    return result.toDto(ProjectResponseDto);
  }

  async deleteProject(id: string): Promise<void> {
    await this.projectsRepository.delete(id);
  }

  async updateProject(id: string, project: UpdateProjectDto): Promise<Project> {
    const existingProject = await this.projectsRepository.findOne({
      where: { id },
    });

    if (!existingProject) throw new NotFoundException('Project not found');

    const updatedProject = this.projectsRepository.merge(
      existingProject,
      project,
    );

    return this.projectsRepository.save(updatedProject);
  }
}
