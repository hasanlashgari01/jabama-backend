import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SendCodeDto, ValidateCodeDto } from "./dto/auth.dto";

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
}
