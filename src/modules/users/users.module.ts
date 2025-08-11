import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User } from "./entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Otp } from "./entities/otp.entity";
import { Profile } from "./entities/profile.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Otp, Profile])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
