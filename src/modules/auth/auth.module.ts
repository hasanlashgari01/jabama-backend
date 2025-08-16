import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Otp } from "../users/entities/otp.entity";
import { User } from "../users/entities/user.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RedisService } from "./redis.service";

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([User, Otp]),
        JwtModule.register({}),
        ConfigModule.forRoot({ isGlobal: true }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtService, ConfigService, RedisService],
    exports: [AuthService, JwtService, TypeOrmModule],
})
export class AuthModule {}
