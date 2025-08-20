import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { StayService } from "./stay.service";
import { CreateStayDto } from "./dto/create-stay.dto";
import { UpdateStayDto } from "./dto/update-stay.dto";
import { RoleAccess } from "src/common/decorators/auth.decorator";
import { Role } from "src/common/enum/user.enum";
import { ApiConsumes } from "@nestjs/swagger";
import { FormType } from "src/common/enum/form-type.enum";

@Controller("stay")
export class StayController {
  constructor(private readonly stayService: StayService) {}

  @Post()
  @RoleAccess(Role.HOST)
  @ApiConsumes(FormType.Multipart)
  create(@Body() createStayDto: CreateStayDto) {
    return this.stayService.create(createStayDto);
  }

  @Get()
  findAll() {
    return this.stayService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.stayService.findOne(+id);
  }

  @Patch(":id")
  @RoleAccess(Role.HOST)
  @ApiConsumes(FormType.Multipart)
  update(@Param("id") id: string, @Body() updateStayDto: UpdateStayDto) {
    return this.stayService.update(+id, updateStayDto);
  }
}
