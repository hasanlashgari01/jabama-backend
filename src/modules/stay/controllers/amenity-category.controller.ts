import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { ApiConsumes } from "@nestjs/swagger";
import { RoleAccess } from "src/common/decorators/auth.decorator";
import { FormType } from "src/common/enum/form-type.enum";
import { Role } from "src/common/enum/user.enum";
import { CreateAmenityCategoryDto, UpdateAmenityCategoryDto } from "../dto/amenity-category.dto";
import { AmenityCategoryService } from "../services/amenity-category.service";

@Controller("amenity-category")
export class AmenityCategoryController {
  constructor(private readonly amenityCategoryService: AmenityCategoryService) {}

  @Post()
  @RoleAccess(Role.ADMIN, Role.MODERATOR)
  @ApiConsumes(FormType.Json, FormType.Multipart)
  @UseInterceptors(AnyFilesInterceptor())
  create(@Body() createAmenityCategoryDto: CreateAmenityCategoryDto) {
    return this.amenityCategoryService.create(createAmenityCategoryDto);
  }

  @Get()
  @RoleAccess(Role.ADMIN, Role.MODERATOR)
  getCategories() {
    return this.amenityCategoryService.getCategories();
  }

  @Get("/amenities")
  getCategoriesWithAmenities() {
    return this.amenityCategoryService.getCategoriesWithAmenities();
  }

  @Put(":id")
  @RoleAccess(Role.ADMIN, Role.MODERATOR)
  @ApiConsumes(FormType.Json, FormType.Multipart)
  @UseInterceptors(AnyFilesInterceptor())
  update(@Param("id") id: string, @Body() updateAmenityCategoryDto: UpdateAmenityCategoryDto) {
    return this.amenityCategoryService.update(+id, updateAmenityCategoryDto);
  }

  @Delete(":id")
  @RoleAccess(Role.ADMIN, Role.MODERATOR)
  remove(@Param("id") id: string) {
    return this.amenityCategoryService.remove(+id);
  }
}
