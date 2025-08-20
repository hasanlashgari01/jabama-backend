import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateCityDto {
  @ApiProperty({ example: "تهران" })
  @IsString()
  name: string;

  @ApiProperty({ example: "tehran" })
  @IsString()
  name_en: string;

  @ApiProperty({ example: "tehran" })
  @IsString()
  slug: string;

  @ApiProperty()
  province_id: number;

  @ApiProperty()
  @IsNumber()
  latitude: number;
  
  @ApiProperty()
  @IsNumber()
  longitude: number;
}
