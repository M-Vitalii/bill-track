import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class EmployeeResponseDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  salary: number;

  @Expose()
  projectId: string;

  @Expose()
  departmentId: string;
}
