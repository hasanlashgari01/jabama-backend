import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenPayload } from "../types/payload.type";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("ACCESS_TOKEN_SECRET")!,
    });

    if (!this.configService.get<string>("ACCESS_TOKEN_SECRET")) {
      throw new Error("ACCESS_TOKEN_SECRET is not set in environment variables");
    }
  }

  async validate(payload: TokenPayload): Promise<TokenPayload> {
    if (!payload.sub) {
      throw new UnauthorizedException("Payload توکن نامعتبر است");
    }
    return {
      sub: payload.sub,
    };
  }
}
