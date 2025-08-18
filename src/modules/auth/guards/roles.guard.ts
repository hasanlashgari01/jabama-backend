import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "src/common/enum/user.enum";
import { AuthService } from "../auth.service";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { extractToken } from "../utils/extract-token.utils";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const token = extractToken(request);
    const payload = await this.authService.verifyAccessToken(token);
    if (!payload) throw new UnauthorizedException("لطفاً ابتدا وارد حساب کاربری خود شوید.");
    const user = await this.authService.findUserById(payload.sub);

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException("برای دسترسی به این منبع، نیاز به سطح دسترسی بالاتری دارید.");
    }

    request.user = payload;

    return true;
  }
}
