import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfig } from "../../configs/typeorm.config";
import { AuthModule } from "../auth/auth.module";
import { AuthService } from "../auth/auth.service";
import { RedisService } from "../auth/redis.service";
import { CityModule } from "../city/city.module";
import { ProvinceModule } from "../province/province.module";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
        }),
        TypeOrmModule.forRoot(TypeOrmConfig()),
        AuthModule,
        UsersModule,
        CityModule,
        ProvinceModule,
    ],
    controllers: [],
    providers: [AuthService, RedisService],
})
export class AppModule {}
