import { UnauthorizedException } from "@nestjs/common";
import { isJWT } from "class-validator";
import { Request } from "express";

export function extractToken(request: Request): string {
  const { authorization } = request.headers;
  if (!authorization || authorization?.trim() === "") {
    throw new UnauthorizedException("لطفاً ابتدا وارد حساب کاربری خود شوید.");
  }

  const [bearer, token] = authorization.split(" ");
  if (bearer?.toLowerCase() !== "bearer" || !token || !isJWT(token)) {
    throw new UnauthorizedException("لطفاً ابتدا وارد حساب کاربری خود شوید.");
  }

  return token;
}
