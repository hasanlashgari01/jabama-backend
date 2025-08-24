import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { RoleAccess } from "src/common/decorators/auth.decorator";
import { FormType } from "src/common/enum/form-type.enum";
import { Role } from "src/common/enum/user.enum";
import { FileValidationPipe } from "src/common/validations/file.validation";
import { CreateStayDto, UpdateStayDto } from "../dto/stay.dto";
import { StayService } from "../services/stay.service";
import { Stay } from "../entities/stay.entity";

@Controller("stay")
export class StayController {
  constructor(private readonly stayService: StayService) {}

  @Post()
  @RoleAccess(Role.HOST)
  @ApiConsumes(FormType.Json, FormType.Multipart)
  @UseInterceptors(FilesInterceptor("images"))
  @UsePipes(new ValidationPipe({ transform: true }))
  create(
    @Body() createStayDto: CreateStayDto,
    @UploadedFiles(new FileValidationPipe({ isArray: true })) files: Express.Multer.File[],
  ) {
    return this.stayService.create(createStayDto, files);
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
