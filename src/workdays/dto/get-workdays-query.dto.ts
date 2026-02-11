import { IsDateString, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/models/dto/pagination';

export class GetWorkdaysQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
