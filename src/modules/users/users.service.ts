import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProfileDto } from "./dto/profile.dto";
import { User } from "./entities/user.entity";
import { Request } from "express";
import { REQUEST } from "@nestjs/core";
import { S3Service } from "../s3/s3.service";
import { Profile } from "./entities/profile.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Profile) private profileRepository: Repository<Profile>,
        @Inject(REQUEST) private request: Request,
        private s3Service: S3Service,
    ) {}

    async updateProfile(avatarFile: Express.Multer.File, profileDto: ProfileDto) {
        const { sub } = this.request.user as UserPayload;

        const user = await this.userRepository.findOneBy({
            mobile_number: sub,
        });
        if (!user) throw new NotFoundException("کاربر مورد نظر پیدا نشد");
        const profile = await this.profileRepository.findOneBy({
            userId: user.id,
        });
        const { first_name, last_name, national_code, gender, bio, birthday, email } = profileDto;
        if (email) {
            const isExistEmail = await this.userRepository.findOneBy({
                email,
            });
            if (isExistEmail) throw new NotFoundException("ایمیل قبلا ثبت شده است");

            await this.userRepository.update(user.id, { email });
        }

        if (profile) {
            if (first_name) profile.first_name = first_name;
            if (last_name) profile.last_name = last_name;
            if (national_code) profile.national_code = national_code;
            if (gender) profile.gender = gender;
            if (bio) profile.bio = bio;
            if (birthday) profile.birthday = birthday;
            if (avatarFile) {
                const { Location } = await this.s3Service.uploadFile(avatarFile, "avatar");
                profile.avatar = Location;
            }

            this.profileRepository.save(profile);
        } else {
            const { Location } = await this.s3Service.uploadFile(avatarFile, "avatar");

            await this.profileRepository.insert({
                avatar: Location,
                first_name,
                last_name,
                national_code,
                gender,
                bio,
                birthday,
            });
        }

        return {
            message: "اطلاعات حساب کاربری با موفقیت ذخیره شد",
        };
    }

    async findByMobile(mobile_number: string, showError: boolean = true) {
        const user = this.userRepository.findOneBy({ mobile_number });
        if (showError && !user) throw new NotFoundException("کاربر مورد نظر پیدا نشد");

        return user;
    }
}
