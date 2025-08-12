import {
    BadRequestException,
    ConflictException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { randomInt } from "crypto";
import { Repository } from "typeorm";
import { Otp } from "../users/entities/otp.entity";
import { User } from "../users/entities/user.entity";
import { SendCodeDto, ValidateCodeDto } from "./dto/auth.dto";
import { AccessTokenPayload, RefreshTokenPayload } from "./types/payload.type";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Otp) private otpRepository: Repository<Otp>,
        private jwtService: JwtService,
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

    async validateCode(validateCodeDto: ValidateCodeDto) {
        const { mobile, code } = validateCodeDto;

        const user = await this.userRepository.findOneBy({
            mobile_number: mobile,
        });
        if (!user) throw new UnauthorizedException("مجددا لاگین کنید");
        const otp = await this.otpRepository.findOneBy({
            userId: user?.id,
        });
        if (!otp) throw new BadRequestException("ابتدا شماره موبایل خود را وارد کنید");
        if (otp?.is_used) throw new ConflictException("مجددا کد ارسال کنید");
        if (otp?.code !== code) throw new ConflictException("کد صحیح نیست");
        if (otp?.expires_In <= new Date(Date.now())) {
            throw new BadRequestException("کد منقضی شده. لطفا مجددا کد ارسال کنید");
        }

        const access_token = this.createAccessToken({ userId: user.id });
        const refresh_token = this.createRefreshToken({ userId: user.id });

        return {
            access_token,
            refresh_token,
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

    async createAccessToken(payload: AccessTokenPayload) {
        const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRE_IN } = process.env;

        const token = this.jwtService.sign(payload, {
            secret: ACCESS_TOKEN_SECRET,
            expiresIn: ACCESS_TOKEN_EXPIRE_IN,
        });

        return token;
    }

    verifyAccessToken(token: string): AccessTokenPayload {
        try {
            return this.jwtService.verify(token, {
                secret: process.env.ACCESS_TOKEN_SECRET,
            });
        } catch (error) {
            throw new UnauthorizedException("مجددا لاگین کنید");
        }
    }

    async createRefreshToken(payload: RefreshTokenPayload) {
        const { REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRE_IN } = process.env;

        const token = this.jwtService.sign(payload, {
            secret: REFRESH_TOKEN_SECRET,
            expiresIn: REFRESH_TOKEN_EXPIRE_IN,
        });

        return token;
    }

    verifyRefreshToken(token: string): RefreshTokenPayload {
        try {
            return this.jwtService.verify(token, {
                secret: process.env.REFRESH_TOKEN_SECRET,
            });
        } catch (error) {
            throw new UnauthorizedException("مجددا لاگین کنید");
        }
    }
}
