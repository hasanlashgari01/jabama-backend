import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";
import { StayArea, StayType } from "../enum/stay.enum";

export class CreateStayDto {
  @ApiProperty({ description: "نام محل اقامت", example: "اجاره بوم گردی كوكه - واحد وگ" })
  @IsString()
  @IsNotEmpty()
  @Length(5, 255)
  name: string;

  @ApiProperty({ description: "منطقه محل اقامت", enum: StayArea, example: StayArea.COASTAL })
  area: StayArea;

  @ApiProperty({ description: "نوع محل اقامت", enum: StayType, example: StayType.VILLA })
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

  @ApiProperty({ description: "شناسه استان", example: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  province_id: number;

  @ApiProperty({ description: "ظرفیت پایه اتاق", example: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  base_room_capacity: number;

  @ApiProperty({ description: "ظرفیت اقامتگاه", example: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  max_capacity: number;

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

  @ApiProperty({ description: "تعداد اتاق خواب", example: 1, required: false })
  @Type(() => Number)
  @IsNumber()
  rooms: number;

  @ApiProperty({ description: "تعداد تخت یک نفره", example: 1, required: false })
  @Type(() => Number)
  @IsNumber()
  single_beds: number;

  @ApiProperty({ description: "تعداد تخت دو نفره", example: 1, required: false })
  @Type(() => Number)
  @IsNumber()
  double_beds: number;

  @ApiProperty({ description: "تعداد تخت سنتی", example: 1, required: false })
  @Type(() => Number)
  @IsNumber()
  traditional_beds: number;

  @ApiProperty({ description: "تعداد حمام", example: 1, required: false })
  @Type(() => Number)
  @IsNumber()
  bathrooms: number;

  @ApiProperty({ description: "تعداد سرویس بهداشتی فرنگی", example: 1, required: false })
  @Type(() => Number)
  @IsNumber()
  western_toilets: number;

  @ApiProperty({ description: "تعداد سرویس بهداشتی ایرانی", example: 1, required: false })
  @Type(() => Number)
  @IsNumber()
  iranian_toilets: number;

  @ApiProperty({ description: "تعداد پارکینگ", example: 1, required: false })
  @Type(() => Number)
  @IsNumber()
  parking_spaces: number;

  @ApiProperty({ description: "تعداد پله ها", example: 0, required: false })
  @Type(() => Number)
  @IsNumber()
  stairs?: number;

  @ApiProperty({ description: "طبقه اقامتگاه", example: 0, required: false })
  @Type(() => Number)
  @IsNumber()
  floor: number;

  @ApiProperty({ type: "array", items: { type: "string", format: "binary" } })
  images: string[];
}

export class UpdateStayDto extends PartialType(CreateStayDto) {}
