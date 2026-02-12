import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateWorkdayDto {
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsNumber()
  @IsNotEmpty()
  hours: number;

  @IsUUID()
  @IsNotEmpty()
  employeeId: string;
}
