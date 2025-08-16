import { PaginationDto } from "../dto/pagination.dto";

export function paginationSolver(paginationDto: PaginationDto) {
  let { page = 0, limit = 10 } = paginationDto;
  if (!page || page <= 1) page = 0;
  else page = page - 1;

  if (!limit || limit <= 0) limit = 10;
  const skip = page * limit;
  return {
    page: page === 0 ? 1 : page,
    limit,
    skip,
  };
}

export function paginationGenerator(total: number = 0, page: number = 0, limit: number = 0) {
  return {
    page: +page,
    limit: +limit,
    total,
    pageCount: Math.ceil(total / limit),
  };
}
