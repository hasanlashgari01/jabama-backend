import { Module } from "@nestjs/common";
import { StayService } from "./stay.service";
import { StayController } from "./stay.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Stay } from "./entities/stay.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Stay])],
  controllers: [StayController],
  providers: [StayService],
})
export class StayModule {}
