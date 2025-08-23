import { Body, Controller, Post } from "@nestjs/common";
import { ApiConsumes } from "@nestjs/swagger";
import { RoleAccess } from "src/common/decorators/auth.decorator";
import { FormType } from "src/common/enum/form-type.enum";
import { Role } from "src/common/enum/user.enum";
import { AmenityCategoryService } from "../services/amenity-category.service";
import { CreateAmenityCategoryDto } from "../dto/amenity-category.dto";

@Controller("amenity-category")
export class AmenityCategoryController {
  constructor(private readonly amenityCategoryService: AmenityCategoryService) {}

  @Post()
  @RoleAccess(Role.ADMIN, Role.MODERATOR)
  @ApiConsumes(FormType.Multipart)
  create(@Body() createAmenityCategoryDto: CreateAmenityCategoryDto) {
    this.amenityCategoryService.create(createAmenityCategoryDto);
  }
}
