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

@Module({
  imports: [TypeOrmModule.forFeature([Stay, StayPhoto, AmenityCategory, Amenity])],
  controllers: [StayController, AmenityCategoryController, AmenityController],
  providers: [StayService, AmenityCategoryService, AmenityService, S3Service],
})
export class StayModule {}
