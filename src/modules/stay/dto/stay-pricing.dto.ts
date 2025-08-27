import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsInt, IsNumber, IsOptional, Min } from "class-validator";

export class StayPricingDto {
  @ApiProperty({ type: Number, description: "شناسه اقامتگاه", example: 1 })
  @IsInt()
  @Min(1)
  stayId: number;

  @ApiProperty({
    type: Date,
    format: "date-time",
    example: "2025-08-28",
    description: "تاریخ شروع (به فرمت ISO 8601)",
  })
  @IsDateString()
  startDate: Date;

  @ApiPropertyOptional({
    type: Date,
    format: "date-time",
    example: "2025-08-26",
    required: false,
    description: "تاریخ پایان (به فرمت ISO 8601، اختیاری)",
  })
  @IsDateString()
  endDate: Date;

  @ApiProperty({ description: "(تومان) قیمت روزانه", example: 100000, type: Number })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    description: "قیمت با تخفیف (اختیاری)",
    example: 900000,
    type: Number,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPrice?: number;
}
