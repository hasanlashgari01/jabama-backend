import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SendCodeDto, ValidateCodeDto } from "./dto/auth.dto";
import { JwtAuthGuard } from "./guards/auth.guard";
import { RefreshAuthGuard } from "./guards/refresh-auth.guard";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("/send-code")
    sendCode(@Body() sendCodeDto: SendCodeDto) {
        return this.authService.sendCode(sendCodeDto);
    }

    @Post("/validate-code")
    validateCode(@Body() validateCodeDto: ValidateCodeDto) {
        return this.authService.validateCode(validateCodeDto);
    }

    @UseGuards(RefreshAuthGuard)
    @Post("refresh")
    refresh(@Req() req) {
        return this.authService.generateTokens(req.user.mobile_number);
    }

    @UseGuards(JwtAuthGuard)
    @Get("me")
    getProfile(@Req() req) {
        return req.user;
    }
}
