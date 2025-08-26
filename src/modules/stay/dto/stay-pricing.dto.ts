import { ApiProperty } from "@nestjs/swagger";

export class StayPricingDto {
  @ApiProperty({ type: Date, format: "date-time", example: "2025-08-28" })
  startDate: Date;

  @ApiProperty({ type: Date, format: "date-time", example: "2025-08-26" })
  endDate: Date;

  @ApiProperty({ type: Number, example: 2 })
  guests: number;
}
