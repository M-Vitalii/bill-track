import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DepartmentsService } from './departments.service';
import { Department } from 'src/database/entities';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto';
import {
  PaginationQueryDto,
  PaginationResponseDto,
} from 'src/common/models/dto/pagination';

jest.mock('src/common/utils/pagination', () => ({
  paginate: jest.fn(),
}));

import { paginate } from 'src/common/utils/pagination';

describe('DepartmentsService', () => {
  let service: DepartmentsService;
  let repository: Repository<Department>;

  const mockDepartment: Department = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Engineering',
  } as Department;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    softDelete: jest.fn(),
    merge: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentsService,
        {
          provide: getRepositoryToken(Department),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DepartmentsService>(DepartmentsService);
    repository = module.get<Repository<Department>>(
      getRepositoryToken(Department),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDepartment', () => {
    const createDto: CreateDepartmentDto = {
      name: 'Engineering',
    };

    it('should successfully create a department', async () => {
      mockRepository.create.mockReturnValue(mockDepartment);
      mockRepository.save.mockResolvedValue(mockDepartment);

      const result = await service.createDepartment(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockDepartment);
      expect(result).toEqual(mockDepartment);
    });

    it('should throw BadRequestException when save fails', async () => {
      mockRepository.create.mockReturnValue(mockDepartment);
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.createDepartment(createDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createDepartment(createDto)).rejects.toThrow(
        'Failed to create department',
      );
    });
  });

  describe('getDepartmentById', () => {
    it('should return a department when found', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockDepartment);

      const result = await service.getDepartmentById(mockDepartment.id);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        id: mockDepartment.id,
      });
      expect(result).toEqual(mockDepartment);
    });

    it('should throw NotFoundException when department not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.getDepartmentById('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getDepartments', () => {
    it('should return paginated departments', async () => {
      const paginationDto: PaginationQueryDto = {
        page: 1,
        pageSize: 10,
      };

      const paginatedResponse: PaginationResponseDto<Department> = {
        data: [mockDepartment],
        meta: {
          total: 1,
          page: 1,
          pageSize: 10,
          pageCount: 1,
        },
      } as PaginationResponseDto<Department>;

      (paginate as jest.Mock).mockResolvedValue(paginatedResponse);

      const result = await service.getDepartments(paginationDto);

      expect(paginate).toHaveBeenCalledWith(repository, paginationDto);
      expect(result).toEqual(paginatedResponse);
    });
  });

  describe('deleteDepartment', () => {
    it('should successfully soft delete a department', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockDepartment);
      mockRepository.softDelete.mockResolvedValue({ affected: 1 });

      await service.deleteDepartment(mockDepartment.id);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        id: mockDepartment.id,
      });
      expect(mockRepository.softDelete).toHaveBeenCalledWith(mockDepartment.id);
    });

    it('should throw NotFoundException when department does not exist', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.deleteDepartment('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );

      expect(mockRepository.softDelete).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when softDelete throws', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockDepartment);
      mockRepository.softDelete.mockRejectedValue(new Error('Database error'));

      await expect(service.deleteDepartment(mockDepartment.id)).rejects.toThrow(
        BadRequestException,
      );

      await expect(service.deleteDepartment(mockDepartment.id)).rejects.toThrow(
        'Failed to delete department',
      );
    });
  });

  describe('updateDepartment', () => {
    const updateDto: UpdateDepartmentDto = {
      name: 'Updated Engineering',
    };

    const updatedDepartment = {
      ...mockDepartment,
      ...updateDto,
    };

    it('should successfully update a department', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockDepartment);
      mockRepository.merge.mockReturnValue(updatedDepartment);
      mockRepository.save.mockResolvedValue(updatedDepartment);

      const result = await service.updateDepartment(
        mockDepartment.id,
        updateDto,
      );

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        id: mockDepartment.id,
      });
      expect(mockRepository.merge).toHaveBeenCalledWith(
        mockDepartment,
        updateDto,
      );
      expect(mockRepository.save).toHaveBeenCalledWith(updatedDepartment);
      expect(result).toEqual(updatedDepartment);
    });

    it('should throw NotFoundException when department not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.updateDepartment('non-existent-id', updateDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.updateDepartment('non-existent-id', updateDto),
      ).rejects.toThrow('Department not found');
    });

    it('should throw BadRequestException when save fails', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockDepartment);
      mockRepository.merge.mockReturnValue(updatedDepartment);
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(
        service.updateDepartment(mockDepartment.id, updateDto),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.updateDepartment(mockDepartment.id, updateDto),
      ).rejects.toThrow('Failed to update department');
    });
  });
});
