import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomInt } from "crypto";
import { Repository } from "typeorm";
import { Otp } from "../users/entities/otp.entity";
import { User } from "../users/entities/user.entity";
import { SendCodeDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Otp) private otpRepository: Repository<Otp>,
    ) {}

    async sendCode(sendCodeDto: SendCodeDto) {
        const { mobile } = sendCodeDto;

        const isExistUser = await this.userRepository.findOneBy({
            mobile_number: mobile,
        });
        if (!isExistUser) {
            const newUser = await this.userRepository.create({
                mobile_number: mobile,
            });
            await this.generateAndSaveOtp(newUser.id);
        } else {
            await this.generateAndSaveOtp(isExistUser.id);
        }

        return {
            mobile,
        };
    }

    async generateAndSaveOtp(userId: number) {
        const otpTime = 1000 * 60 * 2;
        const newOtp = {
            code: randomInt(1000, 9999).toString(),
            expires_In: new Date(Date.now() + otpTime),
        };

        let otp = await this.otpRepository.findOneBy({ userId });
        if (otp) {
            otp.code = newOtp.code;
            otp.expires_In = newOtp.expires_In;
            otp.is_used = false;
        } else {
            otp = this.otpRepository.create({
                code: newOtp.code,
                expires_In: newOtp.expires_In,
                is_used: false,
            });
        }

        await this.otpRepository.save(otp);
    }
}
