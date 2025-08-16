import { IsIn, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";

export class SearchProvinceDto extends PaginationDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  @IsIn(["name", "created_at", "updated_at", "id", "slug"])
  sort?: "name" | "created_at" | "updated_at" | "id" | "slug" = "name";

  @IsOptional()
  @IsString()
  @IsIn(["ASC", "DESC"])
  order?: "ASC" | "DESC" = "ASC";
}
