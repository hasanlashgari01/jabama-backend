import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { CityService } from "./city.service";
import { CreateCityDto } from "./dto/create-city.dto";
import { UpdateCityDto } from "./dto/update-city.dto";
import { SearchCityDto } from "./dto/search-city.dto";

@Controller("city")
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  create(@Body() createCityDto: CreateCityDto) {
    return this.cityService.create(createCityDto);
  }

  @Get()
  findAll(@Query() searchCityDto: SearchCityDto) {
    return this.cityService.findAll(searchCityDto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.cityService.findOneById(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.cityService.update(+id, updateCityDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.cityService.remove(+id);
  }
}
