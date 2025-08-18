import { SetMetadata } from "@nestjs/common";
import { Role } from "src/common/enum/user.enum";

export const ROLES_KEY = "isPublic";

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
