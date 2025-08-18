import {
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class JwtRefreshGuard extends AuthGuard("jwt-refresh") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    return super.canActivate(context);
  }

  handleRequest<TUser>(err: any, user: TUser, info: { message?: string; name?: string }): TUser {
    if (err || !user) {
      let message = "نیاز به احراز هویت دارید";

      if (info?.message) {
        switch (info.message) {
          case "No auth token":
            message = "توکن ارسال نشده است";
            break;
          case "invalid token":
            message = "توکن نامعتبر است";
            break;
          case "jwt expired":
            message = "توکن منقضی شده است";
            break;
          case "invalid signature":
            message = "امضای توکن نامعتبر است";
            break;
          default:
            message = info.message;
        }
      }

      if (err?.name === "TokenExpiredError") {
        message = "توکن منقضی شده است";
      } else if (err?.name === "JsonWebTokenError") {
        message = "توکن نامعتبر است";
      } else if (err?.name === "NotBeforeError") {
        message = "توکن هنوز معتبر نیست";
      }

      throw new UnauthorizedException(message);
    }

    if (err) {
      throw new InternalServerErrorException("خطای داخلی سرور");
    }

    return user;
  }
}
