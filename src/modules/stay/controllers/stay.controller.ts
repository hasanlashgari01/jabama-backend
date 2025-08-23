import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiConsumes } from "@nestjs/swagger";
import { RoleAccess } from "src/common/decorators/auth.decorator";
import { FormType } from "src/common/enum/form-type.enum";
import { Role } from "src/common/enum/user.enum";
import { FileValidationPipe } from "src/common/validations/file.validation";
import { CreateStayDto, UpdateStayDto } from "../dto/stay.dto";
import { StayService } from "../services/stay.service";

@Controller("stay")
export class StayController {
  constructor(private readonly stayService: StayService) {}

  @Post()
  @RoleAccess(Role.HOST)
  @ApiConsumes(FormType.Multipart)
  @UseInterceptors(FilesInterceptor("images"))
  create(
    @Body() createStayDto: CreateStayDto,
    @UploadedFiles(new FileValidationPipe({ isArray: true })) files: Array<Express.Multer.File>,
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
