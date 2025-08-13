import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { Profile } from "./entities/profile.entity";
import { User } from "./entities/user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { S3Service } from "../s3/s3.service";

@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([User, Profile])],
    controllers: [UsersController],
    providers: [UsersService, S3Service],
    exports: [UsersService, S3Service, TypeOrmModule],
})
export class UsersModule {}
