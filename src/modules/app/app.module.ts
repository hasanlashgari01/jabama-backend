import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfig } from "../../configs/typeorm.config";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";
import { CityModule } from "../city/city.module";
import { ProvinceModule } from "../province/province.module";

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
    providers: [],
})
export class AppModule {}
