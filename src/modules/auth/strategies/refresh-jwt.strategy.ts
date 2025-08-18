import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenPayload } from "../types/payload.type";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("REFRESH_TOKEN_SECRET")!,
    });

    if (!this.configService.get<string>("REFRESH_TOKEN_SECRET")) {
      throw new Error("REFRESH_TOKEN_SECRET is not set in environment variables");
    }
  }

  async validate(payload: TokenPayload): Promise<TokenPayload> {
    if (!payload.sub) {
      throw new UnauthorizedException("Payload توکن نامعتبر است");
    }
    return { sub: payload.sub };
  }
}
