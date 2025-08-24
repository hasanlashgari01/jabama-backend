import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from "class-validator";
import { StayArea, StayType } from "../enum/stay.enum";

export class AmenityItemDto {
  @ApiProperty({ description: "شناسه امکانات", example: 1 })
  @IsNumber()
  @IsNotEmpty()
  amenity_id: number;

  @ApiProperty({ description: "وضعیت در دسترس بودن", example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiProperty({ description: "رایگان بودن", example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isFree?: boolean;

  @ApiProperty({ description: "تعداد", example: 2, required: false })
  @IsNumber()
  @IsOptional()
  quantity?: number;

  @ApiProperty({ description: "توضیحات سفارشی", example: "تلویزیون 50 اینچ", required: false })
  @IsString()
  @IsOptional()
  customDescription?: string;
}

export class CreateStayDto {
  @ApiProperty({ description: "نام محل اقامت", example: "اجاره بوم گردی كوكه - واحد وگ" })
  @IsString()
  @IsNotEmpty()
  @Length(5, 255)
  name: string;

  @ApiProperty({ description: "منطقه محل اقامت", enum: StayArea, example: StayArea.COASTAL })
  @IsEnum(StayArea)
  area: StayArea;

  @ApiProperty({ description: "نوع محل اقامت", enum: StayType, example: StayType.VILLA })
  @IsEnum(StayType)
  type: StayType;

  @ApiProperty({ description: "آدرس محل اقامت", example: "مازندران - رامسر" })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: "متراژ محل اقامت", example: 120 })
  @Type(() => Number)
  @IsNumber()
  meterage: number;

  @ApiProperty({ description: "عرض جغرافیایی محل اقامت", example: 35.6892, required: false })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ description: "طول جغرافیایی محل اقامت", example: 51.389, required: false })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ description: "شناسه شهر", example: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  city_id: number;

  @ApiProperty({
    description: "توضیحات اقامتگاه",
    example:
      "بومگردی کوکه در فضایی 3000 متری در رامسر (روستای واچکلایه) در دل جنگل‌های باصفای صفارود در مسیر جاده جواهرده واقع شده است.",
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: "توصیف فضای اقامتگاه و واحد",
    example: "فضای بسیار دنج و آرام",
    required: false,
  })
  @IsString()
  @IsOptional()
  description_space?: string;

  @ApiProperty({
    description: "امکانات مشترک اقامتگاه",
    example: "داخل اقامتگاه 2 جای پارک خودرو به صورت اشتراکی در اختیار هر واحد قرار داده می شود.",
    required: false,
  })
  @IsString()
  @IsOptional()
  description_shared_space?: string;

  @ApiProperty({
    description: "توضیحات اضافی اقامتگاه",
    example: "پذیرش تا ساعت 12 بامداد امکان پذیر می باشد. وضعیت آنتن دهی عالی می باشد.",
    required: false,
  })
  @IsString()
  @IsOptional()
  description_additional?: string;

  @ApiProperty({ description: "لیست امکانات اقامتگاه", type: () => AmenityItemDto })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AmenityItemDto)
  @IsNotEmpty()
  amenities: AmenityItemDto[];

  @ApiProperty({
    description: "تصاویر اقامتگاه",
    type: "array",
    items: { type: "string", format: "binary" },
  })
  @IsArray()
  @IsOptional()
  images: string[];
}

export class UpdateStayDto extends PartialType(CreateStayDto) {}
