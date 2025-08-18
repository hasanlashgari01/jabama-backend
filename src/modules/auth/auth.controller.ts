import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes } from "@nestjs/swagger";
import { Authorization } from "src/common/decorators/auth.decorator";
import { FormType } from "src/common/enum/form-type.enum";
import { AuthService } from "./auth.service";
import { Public } from "./decorators/public.decorator";
import { SendCodeDto, ValidateCodeDto } from "./dto/auth.dto";
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/send-code")
  @ApiConsumes(FormType.Urlencoded)
  sendCode(@Body() sendCodeDto: SendCodeDto) {
    return this.authService.sendCode(sendCodeDto);
  }

  @Post("/validate-code")
  @ApiConsumes(FormType.Urlencoded)
  validateCode(@Body() validateCodeDto: ValidateCodeDto) {
    return this.authService.validateCode(validateCodeDto);
  }

  @Post("refresh")
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth("Authorization")
  async refresh() {
    return this.authService.refreshToken();
  }

  @Get("me")
  @Authorization()
  getProfile() {
    return this.authService.getMe();
  }
}
