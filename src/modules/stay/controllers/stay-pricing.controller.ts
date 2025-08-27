import { Body, Controller, Post } from "@nestjs/common";
import { StayPricingService } from "../services/stay-pricing.service";
import { StayPricingDto } from "../dto/stay-pricing.dto";
import { RoleAccess } from "src/common/decorators/auth.decorator";
import { Role } from "src/common/enum/user.enum";
import { ApiConsumes } from "@nestjs/swagger";
import { FormType } from "src/common/enum/form-type.enum";

@Controller("stay-pricing")
export class StayPricingController {
  constructor(private readonly stayPricingService: StayPricingService) {}

  @Post()
  @RoleAccess(Role.HOST)
  @ApiConsumes(FormType.Json, FormType.Multipart)
  create(@Body() stayPricingDto: StayPricingDto) {
    return this.stayPricingService.create(stayPricingDto);
  }
}
