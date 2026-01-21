import {
  ClassConstructor,
  Expose,
  plainToInstance,
  Type,
} from 'class-transformer';
import { PaginationMetaDto } from './pagination-meta.dto';

export class PaginationResponseDto<T> {
  @Expose()
  data: T[];

  @Expose()
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto;

  constructor(partial?: Partial<PaginationResponseDto<T>>) {
    Object.assign(this, partial);
  }

  toDto<V>(dtoClass: ClassConstructor<V>): PaginationResponseDto<V> {
    return new PaginationResponseDto<V>({
      ...this,
      data: plainToInstance(dtoClass, this.data),
    });
  }
}
