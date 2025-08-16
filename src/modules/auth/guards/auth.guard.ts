import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "../auth.service";
import { extractToken } from "../utils/extract-token.utils";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    // private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    // const isSkippedAuthorization = this.reflector.get<boolean>(SKIP_AUTH, context.getHandler());
    // if (isSkippedAuthorization) return true;
    const request: Request = context.switchToHttp().getRequest();
    const token = extractToken(request);
    const payload = await this.authService.verifyAccessToken(token);
    if (!payload) throw new UnauthorizedException("نیاز به احراز هویت دارد");

    request.user = payload;

    return true;
  }
}
