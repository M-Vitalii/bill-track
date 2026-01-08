import { Expose } from 'class-transformer';

export class PaginationMetaDto {
  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  pageSize: number;

  @Expose()
  pageCount: number;
}
