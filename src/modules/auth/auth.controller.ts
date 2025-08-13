import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes } from "@nestjs/swagger";
import { Authorization } from "src/common/decorators/auth.decorator";
import { AuthService } from "./auth.service";
import { SendCodeDto, ValidateCodeDto } from "./dto/auth.dto";
import { RefreshAuthGuard } from "./guards/refresh-auth.guard";
import { FormType } from "src/common/enum/form-type.enum";

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

    @UseGuards(RefreshAuthGuard)
    @ApiBearerAuth("Authorization")
    @Post("refresh")
    refresh(@Req() req) {
        return this.authService.generateTokens(req.user.mobile_number);
    }

    @Get("me")
    @Authorization()
    getProfile(@Req() req) {
        return req.user;
    }
}
