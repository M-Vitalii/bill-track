import { FindManyOptions, ObjectLiteral, Repository } from 'typeorm';
import {
  PaginationQueryDto,
  PaginationResponseDto,
} from '../../models/dto/pagination';

export async function paginate<T extends ObjectLiteral>(
  repository: Repository<T>,
  query: PaginationQueryDto,
  options?: FindManyOptions<T>,
): Promise<PaginationResponseDto<T>> {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 10;

  const skip = (page - 1) * pageSize;

  const [data, total] = await repository.findAndCount({
    take: pageSize,
    skip,
    ...options,
  });

  return new PaginationResponseDto<T>({
    data,
    meta: {
      total,
      page,
      pageSize,
      pageCount: Math.ceil(total / pageSize),
    },
  });
}
