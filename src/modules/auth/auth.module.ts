import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { Otp } from "../users/entities/otp.entity";
import { JwtModule } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { RefreshJwtStrategy } from "./strategies/refresh-jwt.strategy";

@Module({
    imports: [TypeOrmModule.forFeature([User, Otp]), JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, UsersService, JwtStrategy, RefreshJwtStrategy],
})
export class AuthModule {}
