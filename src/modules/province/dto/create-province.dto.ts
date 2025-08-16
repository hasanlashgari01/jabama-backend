import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateProvinceDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(100)
  name_en: string;

  @IsString()
  @MaxLength(100)
  slug: string;
}
