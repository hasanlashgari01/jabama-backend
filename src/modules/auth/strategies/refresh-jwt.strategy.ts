import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../../users/users.service";
import { TokenPayload } from "../types/payload.type";

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor(
        private configService: ConfigService,
        private usersService: UsersService,
    ) {
        const refreshSecret = configService.get<string>("REFRESH_TOKEN_SECRET");
        if (!refreshSecret) {
            throw new Error("REFRESH_TOKEN_SECRET is not set in environment variables");
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: refreshSecret,
        });
    }

    async validate(payload: TokenPayload) {
        const user = await this.usersService.findByMobile(payload.sub);
        if (!user) {
            throw new UnauthorizedException("نیاز به احراز هویت دارد");
        }
        return user;
    }
}
