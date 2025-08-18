import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Province } from "./entities/province.entity";
import { ProvinceController } from "./province.controller";
import { ProvinceService } from "./province.service";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Module({
  imports: [TypeOrmModule.forFeature([Province])],
  controllers: [ProvinceController],
  providers: [ProvinceService],
})
export class ProvinceModule {}
