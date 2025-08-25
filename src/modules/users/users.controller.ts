import { Body, Controller, Get, Param, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes } from "@nestjs/swagger";
import { Authorization } from "src/common/decorators/auth.decorator";
import { FormType } from "src/common/enum/form-type.enum";
import { ImageValidationPipe } from "src/common/validations/image.validation";
import { ProfileDto } from "./dto/profile.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put("/profile")
  @Authorization()
  @ApiConsumes(FormType.Multipart)
  @UseInterceptors(FileInterceptor("avatar"))
  updateProfile(
    @UploadedFile(new ImageValidationPipe()) avatarFile: Express.Multer.File,
    @Body() profileDto: ProfileDto,
  ) {
    return this.usersService.updateProfile(avatarFile, profileDto);
  }

  @Get("/profile")
  @Authorization()
  getProfile() {
    return this.usersService.getProfile();
  }
}
