import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class UUIDParam {
  @IsUUID()
  id: string;
}

export const ListInput = <SearchInput, WhereInput>(
  orderByColumns: Array<keyof SearchInput>,
) => {
  class ListInput {
    @IsOptional()
    @IsString()
    q?: string;

    where?: WhereInput;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    page?: number = 1;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Min(10)
    @Max(100)
    @Type(() => Number)
    pageSize?: number = 10;

    @IsOptional()
    @IsString()
    @IsIn(orderByColumns)
    orderBy?: keyof SearchInput;

    @IsOptional()
    @IsEnum(Prisma.SortOrder)
    sortOrder?: Prisma.SortOrder = Prisma.SortOrder.asc;
  }

  return ListInput;
};

export class ListOutput<T> {
  items: T[];
  total: number;
}
