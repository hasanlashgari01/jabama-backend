import { UnauthorizedException } from "@nestjs/common";
import { isJWT } from "class-validator";
import { Request } from "express";

export function extractToken(request: Request): string {
    const { authorization } = request.headers;
    if (!authorization || authorization?.trim() === "") {
        throw new UnauthorizedException("نیاز به احراز هویت دارد");
    }

    const [bearer, token] = authorization.split(" ");
    if (bearer?.toLowerCase() !== "bearer" || !token || !isJWT(token)) {
        throw new UnauthorizedException("نیاز به احراز هویت دارد");
    }

    return token;
}

export function extractTokenOptional(request: Request): string | undefined {
    const { authorization } = request.headers;
    if (!authorization || authorization.trim() === "") return;

    const [bearer, token] = authorization.split(" ");
    if (bearer?.toLowerCase() !== "bearer" || !token || !isJWT(token)) return;

    return token;
}
