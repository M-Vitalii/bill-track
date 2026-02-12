import { Module } from '@nestjs/common';
import { WorkdaysController } from './workdays.controller';
import { WorkdaysService } from './workdays.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee, Workday } from 'src/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Workday, Employee])],
  controllers: [WorkdaysController],
  providers: [WorkdaysService],
})
export class WorkdaysModule {}
