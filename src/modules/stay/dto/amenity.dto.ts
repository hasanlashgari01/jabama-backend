import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAmenityDto {
  @ApiProperty({ description: "عنوان", example: "استخر", type: String })
  @IsString()
  name: string;

  @ApiProperty({ description: "آیکون امکانات", type: "string", format: "binary" })
  @IsOptional()
  icon: string;

  @ApiProperty({
    description: "توضیحات",
    default: "",
    example: "توضیحات اضافی",
    required: false,
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ description: "شناسه دسته بندی", example: "1" })
  @Type(() => Number)
  @IsNotEmpty()
  category_id: number;
}

export class UpdateAmenityDto extends PartialType(CreateAmenityDto) {}
