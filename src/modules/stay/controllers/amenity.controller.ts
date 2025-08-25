import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes } from "@nestjs/swagger";
import { RoleAccess } from "src/common/decorators/auth.decorator";
import { FormType } from "src/common/enum/form-type.enum";
import { Role } from "src/common/enum/user.enum";
import { FileValidationPipe } from "src/common/validations/file.validation";
import { CreateAmenityDto, UpdateAmenityDto } from "../dto/amenity.dto";
import { AmenityService } from "../services/amenity.service";

@Controller("amenity")
export class AmenityController {
  constructor(private readonly amenityService: AmenityService) {}

  @Post()
  @RoleAccess(Role.ADMIN, Role.MODERATOR)
  @ApiConsumes(FormType.Json, FormType.Multipart)
  @UseInterceptors(FileInterceptor("icon"))
  create(
    @Body() createAmenityDto: CreateAmenityDto,
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ) {
    return this.amenityService.create(createAmenityDto, file);
  }

  @Get()
  async getCategories() {
    return this.amenityService.getAmenities();
  }

  @Put(":id")
  @RoleAccess(Role.ADMIN, Role.MODERATOR)
  @ApiConsumes(FormType.Json, FormType.Multipart)
  @UseInterceptors(FileInterceptor("icon"))
  update(
    @Param("id") id: string,
    @Body() updateAmenityDto: UpdateAmenityDto,
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ) {
    return this.amenityService.update(+id, updateAmenityDto, file);
  }

  @Delete(":id")
  @RoleAccess(Role.ADMIN, Role.MODERATOR)
  remove(@Param("id") id: string) {
    return this.amenityService.remove(+id);
  }
}
