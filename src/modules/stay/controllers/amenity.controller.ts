import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { AmenityService } from "../services/amenity.service";
import { RoleAccess } from "src/common/decorators/auth.decorator";
import { ApiConsumes } from "@nestjs/swagger";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { Role } from "src/common/enum/user.enum";
import { FormType } from "src/common/enum/form-type.enum";
import { CreateAmenityDto } from "../dto/amenity.dto";

@Controller("amenity")
export class AmenityController {
  constructor(private readonly amenityService: AmenityService) {}

  @Post()
  @RoleAccess(Role.ADMIN, Role.MODERATOR)
  @ApiConsumes(FormType.Json, FormType.Multipart)
  @UseInterceptors(AnyFilesInterceptor())
  create(@Body() createAmenityDto: CreateAmenityDto) {
    return this.amenityService.create(createAmenityDto);
  }
}
