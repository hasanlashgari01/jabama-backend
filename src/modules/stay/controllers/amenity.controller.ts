import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from "@nestjs/common";
import { AmenityService } from "../services/amenity.service";
import { RoleAccess } from "src/common/decorators/auth.decorator";
import { ApiConsumes } from "@nestjs/swagger";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { Role } from "src/common/enum/user.enum";
import { FormType } from "src/common/enum/form-type.enum";
import { CreateAmenityDto, UpdateAmenityDto } from "../dto/amenity.dto";

@Controller("amenity")
export class AmenityController {
  constructor(private readonly amenityService: AmenityService) {}

  @Post()
  @RoleAccess(Role.ADMIN, Role.MODERATOR)
  @ApiConsumes(FormType.Json, FormType.Multipart)
  create(@Body() createAmenityDto: CreateAmenityDto) {
    return this.amenityService.create(createAmenityDto);
  }

  @Get()
  async getCategories() {
    return this.amenityService.getAmenities();
  }

  @Put(":id")
  @RoleAccess(Role.ADMIN, Role.MODERATOR)
  @ApiConsumes(FormType.Json, FormType.Multipart)
  update(@Param("id") id: string, @Body() updateAmenityDto: UpdateAmenityDto) {
    return this.amenityService.update(+id, updateAmenityDto);
  }

  @Delete(":id")
  @RoleAccess(Role.ADMIN, Role.MODERATOR)
  remove(@Param("id") id: string) {
    return this.amenityService.remove(+id);
  }
}
