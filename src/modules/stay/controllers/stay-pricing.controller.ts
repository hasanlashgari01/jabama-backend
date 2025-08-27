import { BadRequestException, Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiConsumes } from "@nestjs/swagger";
import { RoleAccess } from "src/common/decorators/auth.decorator";
import { FormType } from "src/common/enum/form-type.enum";
import { Role } from "src/common/enum/user.enum";
import { StayPricingDto } from "../dto/stay-pricing.dto";
import { StayPricingService } from "../services/stay-pricing.service";

@Controller("stay-pricing")
export class StayPricingController {
  constructor(private readonly stayPricingService: StayPricingService) {}

  @Post()
  @RoleAccess(Role.HOST)
  @ApiConsumes(FormType.Json, FormType.Multipart)
  create(@Body() stayPricingDto: StayPricingDto) {
    return this.stayPricingService.create(stayPricingDto);
  }

  @Get()
  getPricingByDate(@Query("stayId") stayId: string, @Query("date") date: string) {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException("تاریخ باید به فرمت معتبر ISO 8601 باشد (مثلاً 2025-08-27)");
    }

    return this.stayPricingService.getPricingByDate(+stayId, parsedDate);
  }
}
