import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmpty, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";
import { StayArea, StayType } from "../enum/stay.enum";

type AmenityItem = {
  id: number;
  isAvailable?: boolean;
  isFree?: boolean;
  quantity?: number;
  customDescription?: string;
};

export class CreateStayDto {
  @ApiProperty({ description: "نام محل اقامت", example: "اجاره بوم گردی كوكه - واحد وگ" })
  @IsString()
  @IsNotEmpty()
  @Length(5, 255)
  name: string;

  @ApiProperty({ description: "منطقه محل اقامت", enum: StayArea, example: StayArea.COASTAL })
  @IsString()
  area: StayArea;

  @ApiProperty({ description: "نوع محل اقامت", enum: StayType, example: StayType.VILLA })
  @IsString()
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
  latitude?: number;

  @ApiProperty({ description: "طول جغرافیایی محل اقامت", example: 51.389, required: false })
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @ApiProperty({ description: "شناسه میزبان", example: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  host_id: number;

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
  description_space?: string;

  @ApiProperty({
    description: "امکانات مشترک اقامتگاه",
    example: "داخل اقامتگاه 2 جای پارک خودرو به صورت اشتراکی در اختیار هر واحد قرار داده می شود.",
    required: false,
  })
  @IsString()
  description_shared_space?: string;

  @ApiProperty({
    description: "توضیحات اضافی اقامتگاه",
    example: "پذیرش تا ساعت 12 بامداد امکان پذیر می باشد. وضعیت آنتن دهی عالی می باشد.",
    required: false,
  })
  @IsString()
  description_additional?: string;

  @ApiProperty({
    description: "لیست امکانات اقامتگاه",
    type: "array",
    items: {
      type: "object",
      properties: {
        id: { type: "number", example: 1 },
        isAvailable: { type: "boolean", example: true },
        isFree: { type: "boolean", example: false },
        quantity: { type: "number", example: 3 },
        customDescription: { type: "string", example: "تخت دو نفره بزرگ" },
      },
    },
  })
  @IsNotEmpty()
  amenities: AmenityItem[];

  @ApiProperty({ type: "array", items: { type: "string", format: "binary" } })
  @IsEmpty()
  images: string[];
}

export class UpdateStayDto extends PartialType(CreateStayDto) {}
