import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/modules/users/users.service";
import { TokenPayload } from "../types/payload.type";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(
        private configService: ConfigService,
        private usersService: UsersService,
    ) {
        const accessSecret = configService.get<string>("ACCESS_TOKEN_SECRET");

        if (!accessSecret) {
            throw new Error("ACCESS_TOKEN_SECRET is not set in environment variables");
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: accessSecret,
        });
    }

    async validate(payload: TokenPayload) {
        const user = await this.usersService.findByMobile(payload.sub, false);
        if (!user) throw new UnauthorizedException("نیاز به احراز هویت دارد");

        return user;
    }
}
