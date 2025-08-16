import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";

export class SearchProvinceDto extends PaginationDto {
  @ApiPropertyOptional({ example: "" })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ example: "" })
  @IsOptional()
  @IsString()
  @IsIn(["name", "created_at", "updated_at", "id", "slug"])
  sort?: "name" | "created_at" | "updated_at" | "id" | "slug" = "name";

  @ApiPropertyOptional({ example: "" })
  @IsOptional()
  @IsString()
  @IsIn(["ASC", "DESC"])
  order?: "ASC" | "DESC" = "ASC";
}
