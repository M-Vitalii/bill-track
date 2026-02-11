import { Expose, Type } from 'class-transformer';
import { EmployeeResponseDto } from 'src/employees/dto/employee-response.dto';

export class WorkdayResponseDto {
  @Expose()
  id: string;

  @Expose()
  date: Date;

  @Expose()
  hours: number;

  @Expose()
  @Type(() => EmployeeResponseDto)
  employee: EmployeeResponseDto;
}
