import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";

export class CreateProvinceDto {
  @ApiProperty({ example: "" })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: "" })
  @IsString()
  @MaxLength(100)
  name_en: string;

  @ApiProperty({ example: "" })
  @IsString()
  @MaxLength(100)
  slug: string;
}
