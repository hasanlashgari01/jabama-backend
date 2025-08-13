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
import { TokenPayload } from "./types/payload.type";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { RedisService } from "./redis.service";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Otp) private otpRepository: Repository<Otp>,
        private jwtService: JwtService,
        private configService: ConfigService,
        private readonly redisService: RedisService,
    ) {}

    async sendCode(sendCodeDto: SendCodeDto) {
        const { mobile } = sendCodeDto;

        let user = await this.userRepository.findOneBy({
            mobile_number: mobile,
        });
        if (!user) {
            const newUser = this.userRepository.create({
                mobile_number: mobile,
                email: `${mobile}@gmail.com`,
            });

            user = await this.userRepository.save(newUser);
        }

        await this.redisService.setValue("mobile", mobile, 120);

        const otp = await this.generateAndSaveOtp(user.id);
        if (!user.otp) {
            await this.userRepository.update(user.id, {
                otp: otp,
            });
        }

        return {
            mobile,
        };
    }

    async validateCode(validateCodeDto: ValidateCodeDto) {
        const { code } = validateCodeDto;

        const mobile = await this.redisService.getValue("mobile");

        const user = await this.userRepository.findOneBy({
            mobile_number: mobile,
        });
        if (!user) throw new UnauthorizedException("نیاز به احراز هویت دارد");
        const otp = await this.otpRepository.findOneBy({
            userId: user.id,
        });
        if (!otp) throw new BadRequestException("ابتدا شماره موبایل خود را وارد کنید");
        if (otp.is_used) throw new ConflictException("مجددا کد ارسال کنید");
        if (!(await bcrypt.compare(code, otp.code))) throw new ConflictException("کد صحیح نیست");
        if (otp.expires_In.getTime() <= Date.now()) {
            throw new BadRequestException("کد منقضی شده. لطفا مجددا کد ارسال کنید");
        }

        otp.is_used = true;
        await this.otpRepository.save(otp);

        const tokens = this.generateTokens(mobile);

        return {
            ...tokens,
            message: "ورود به حساب کاربری موفقیت آمیز بود",
        };
    }

    async generateAndSaveOtp(userId: number) {
        const otpTime = 1000 * 60 * 2;
        const plainOtp = randomInt(1000, 9999).toString();
        const hashedOtp = await bcrypt.hash(plainOtp, 10);

        let otp = await this.otpRepository.findOneBy({ userId });

        if (!otp) {
            otp = this.otpRepository.create({
                code: hashedOtp,
                expires_In: new Date(Date.now() + otpTime),
                is_used: false,
                userId,
            });
        } else {
            otp.code = hashedOtp;
            otp.expires_In = new Date(Date.now() + otpTime);
            otp.is_used = false;
        }

        const savedOtp = await this.otpRepository.save(otp);

        console.log(`OTP for user ${userId}: ${plainOtp}`);

        return savedOtp;
    }

    generateTokens(mobile: string): { access_token: string; refresh_token: string } {
        const payload = { sub: mobile };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("ACCESS_TOKEN_SECRET"),
            expiresIn: this.configService.get<string>("ACCESS_TOKEN_EXPIRE_IN"),
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
            expiresIn: this.configService.get<string>("REFRESH_TOKEN_EXPIRE_IN"),
        });

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    async verifyAccessToken(token: string): Promise<User | null | undefined> {
        try {
            const payload = this.jwtService.verify<TokenPayload>(token, {
                secret: process.env.ACCESS_TOKEN_SECRET,
            });

            if (typeof payload === "object" && payload.sub) {
                const user = await this.userRepository.findOneBy({
                    mobile_number: payload.sub,
                });
                if (!user) new UnauthorizedException("نیاز به احراز هویت دارد");

                return user;
            }
        } catch (error) {
            throw new UnauthorizedException("نیاز به احراز هویت دارد");
        }
    }

    async verifyRefreshToken(token: string): Promise<User | null | undefined> {
        try {
            const payload = this.jwtService.verify<TokenPayload>(token, {
                secret: process.env.REFRESH_TOKEN_SECRET,
            });

            if (typeof payload === "object" && payload.sub) {
                const user = await this.userRepository.findOneBy({
                    mobile_number: payload.sub,
                });
                if (!user) new UnauthorizedException("نیاز به احراز هویت دارد");

                return user;
            }
        } catch (error) {
            throw new UnauthorizedException("نیاز به احراز هویت دارد");
        }
    }
}
