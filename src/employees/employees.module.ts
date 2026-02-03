import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department, Employee, Project } from 'src/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Department, Project])],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
