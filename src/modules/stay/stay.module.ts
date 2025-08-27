import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { S3Service } from "../s3/s3.service";
import { AmenityCategoryController } from "./controllers/amenity-category.controller";
import { AmenityController } from "./controllers/amenity.controller";
import { StayController } from "./controllers/stay.controller";
import { StayPhoto } from "./entities/stay-photo.entity";
import { Stay } from "./entities/stay.entity";
import { AmenityCategoryService } from "./services/amenity-category.service";
import { AmenityService } from "./services/amenity.service";
import { StayService } from "./services/stay.service";
import { AmenityCategory } from "./entities/amenity-category.entity";
import { Amenity } from "./entities/amenity.entity";
import { StayAmenity } from "./entities/stay-amenity.entity";
import { City } from "../city/entities/city.entity";
import { StayPricing } from "./entities/stay-pricing.entity";
import { StayPricingController } from "./controllers/stay-pricing.controller";
import { StayPricingService } from "./services/stay-pricing.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Stay,
      StayPhoto,
      AmenityCategory,
      StayAmenity,
      Amenity,
      StayPricing,
      City,
    ]),
  ],
  controllers: [
    AmenityCategoryController,
    AmenityController,
    StayController,
    StayPricingController,
  ],
  providers: [StayService, AmenityCategoryService, AmenityService, S3Service, StayPricingService],
})
export class StayModule {}
