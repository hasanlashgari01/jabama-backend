import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ProvinceService } from "./province.service";
import { CreateProvinceDto } from "./dto/create-province.dto";
import { UpdateProvinceDto } from "./dto/update-province.dto";
import { Authorization, RoleAccess } from "src/common/decorators/auth.decorator";
import { ApiBearerAuth, ApiConsumes } from "@nestjs/swagger";
import { FormType } from "src/common/enum/form-type.enum";
import { SearchProvinceDto } from "./dto/search-province.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Public } from "../auth/decorators/public.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "src/common/enum/user.enum";
import { RolesGuard } from "../auth/guards/roles.guard";

@Controller("province")
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Post()
  @RoleAccess(Role.ADMIN, Role.MODERATOR)
  @ApiConsumes(FormType.Urlencoded)
  create(@Body() createProvinceDto: CreateProvinceDto) {
    return this.provinceService.create(createProvinceDto);
  }

  @Get()
  @Public()
  findAll(@Query() searchProvinceDto: SearchProvinceDto) {
    return this.provinceService.findAll(searchProvinceDto);
  }

  @Patch(":id")
  @RoleAccess(Role.ADMIN, Role.MODERATOR)
  @ApiConsumes(FormType.Urlencoded)
  update(@Param("id") id: string, @Body() updateProvinceDto: UpdateProvinceDto) {
    return this.provinceService.update(+id, updateProvinceDto);
  }

  @Delete(":id")
  @RoleAccess(Role.ADMIN, Role.MODERATOR)
  @ApiConsumes(FormType.Urlencoded)
  remove(@Param("id") id: string) {
    return this.provinceService.remove(+id);
  }
}
