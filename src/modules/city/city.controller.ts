import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { CityService } from "./city.service";
import { CreateCityDto } from "./dto/create-city.dto";
import { UpdateCityDto } from "./dto/update-city.dto";
import { SearchCityDto } from "./dto/search-city.dto";
import { Public } from "../auth/decorators/public.decorator";
import { RoleAccess } from "src/common/decorators/auth.decorator";
import { Role } from "src/common/enum/user.enum";

@Controller("city")
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  @RoleAccess(Role.ADMIN, Role.MODERATOR)
  create(@Body() createCityDto: CreateCityDto) {
    return this.cityService.create(createCityDto);
  }

  @Get()
  @Public()
  findAll(@Query() searchCityDto: SearchCityDto) {
    return this.cityService.findAll(searchCityDto);
  }

  @Get(":id")
  @RoleAccess(Role.ADMIN, Role.MODERATOR)
  findOne(@Param("id") id: string) {
    return this.cityService.findOneById(+id);
  }

  @Patch(":id")
  @RoleAccess(Role.ADMIN, Role.MODERATOR)
  update(@Param("id") id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.cityService.update(+id, updateCityDto);
  }

  @Delete(":id")
  @RoleAccess(Role.ADMIN, Role.MODERATOR)
  remove(@Param("id") id: string) {
    return this.cityService.remove(+id);
  }
}
