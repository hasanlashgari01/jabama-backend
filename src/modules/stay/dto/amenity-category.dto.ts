import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAmenityCategoryDto {
  @ApiProperty({ description: "عنوان دسته بندی", example: "امکانات رفاهی", type: String })
  @IsString()
  name: string;

  @ApiProperty({
    description: "توضیحات دسته بندی",
    default: "",
    example: "توضیحات اضافی",
    required: false,
  })
  @IsOptional()
  @IsString()
  description: string;
}

export class UpdateAmenityCategoryDto extends PartialType(CreateAmenityCategoryDto) {}
