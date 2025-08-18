import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { Role } from "../enum/user.enum";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/decorators/roles.decorator";

export function Authorization() {
  return applyDecorators(ApiBearerAuth("Authorization"), UseGuards(JwtAuthGuard));
}

export function RoleAccess(...roles: Role[]) {
  return applyDecorators(ApiBearerAuth("Authorization"), UseGuards(RolesGuard), Roles(...roles));
}
