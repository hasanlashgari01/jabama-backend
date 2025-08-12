import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SendCodeDto, ValidateCodeDto } from "./dto/auth.dto";
import { JwtAuthGuard } from "./guards/auth.guard";
import { RefreshAuthGuard } from "./guards/refresh-auth.guard";
import { ApiBearerAuth, ApiConsumes } from "@nestjs/swagger";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("/send-code")
    @ApiConsumes("application/x-www-form-urlencoded")
    sendCode(@Body() sendCodeDto: SendCodeDto) {
        return this.authService.sendCode(sendCodeDto);
    }

    @Post("/validate-code")
    @ApiConsumes("application/x-www-form-urlencoded")
    validateCode(@Body() validateCodeDto: ValidateCodeDto) {
        return this.authService.validateCode(validateCodeDto);
    }

    @UseGuards(RefreshAuthGuard)
    @ApiBearerAuth("Authorization")
    @Post("refresh")
    refresh(@Req() req) {
        return this.authService.generateTokens(req.user.mobile_number);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth("Authorization")
    @Get("me")
    getProfile(@Req() req) {
        return req.user;
    }
}
