import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { ProvinceService } from "./province.service";
import { CreateProvinceDto } from "./dto/create-province.dto";
import { UpdateProvinceDto } from "./dto/update-province.dto";
import { Authorization } from "src/common/decorators/auth.decorator";
import { ApiConsumes } from "@nestjs/swagger";
import { FormType } from "src/common/enum/form-type.enum";
import { SearchProvinceDto } from "./dto/search-province.dto";

@Controller("province")
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Post()
  // @Authorization()
  @ApiConsumes(FormType.Urlencoded)
  create(@Body() createProvinceDto: CreateProvinceDto) {
    return this.provinceService.create(createProvinceDto);
  }

  @Get()
  findAll(@Query() searchProvinceDto: SearchProvinceDto) {
    return this.provinceService.findAll(searchProvinceDto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateProvinceDto: UpdateProvinceDto) {
    return this.provinceService.update(+id, updateProvinceDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.provinceService.remove(+id);
  }
}
