import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { REQUEST } from "@nestjs/core";
import { JsonWebTokenError, JwtService, NotBeforeError, TokenExpiredError } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { randomInt } from "crypto";
import { Request } from "express";
import { Repository } from "typeorm";
import { Otp } from "../users/entities/otp.entity";
import { User } from "../users/entities/user.entity";
import { SendCodeDto, ValidateCodeDto } from "./dto/auth.dto";
import { RedisService } from "./redis.service";
import { TokenPayload } from "./types/payload.type";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Otp) private otpRepository: Repository<Otp>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly redisService: RedisService,
    @Inject(REQUEST) private readonly request: Request,
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

    const access_token = this.createAccessToken({ sub: user.id });
    const refresh_token = this.createRefreshToken({ sub: user.id });

    return {
      access_token,
      refresh_token,
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

  async refreshToken() {
    const { sub } = this.request?.user as UserPayload;

    try {
      const user = await this.findUserById(sub);
      const access_token = this.createAccessToken({
        sub: user.id,
      });

      return { access_token };
    } catch (error) {
      throw new UnauthorizedException("توکن رفرش نامعتبر است");
    }
  }

  async getMe() {
    const { sub } = this.request.user as UserPayload;

    const user = await this.userRepository.findOneBy({ id: sub });
    if (!user) throw new NotFoundException("کاربری با این مشخصات وجود ندارد.");

    return user;
  }

  createAccessToken(payload: TokenPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("ACCESS_TOKEN_SECRET"),
      expiresIn: this.configService.get<string>("ACCESS_TOKEN_EXPIRE_IN"),
    });

    return accessToken;
  }

  createRefreshToken(payload: TokenPayload) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
      expiresIn: this.configService.get<string>("REFRESH_TOKEN_EXPIRE_IN"),
    });

    return refreshToken;
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    if (!token) {
      throw new UnauthorizedException("توکن ارسال نشده است");
    }

    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: this.configService.get<string>("ACCESS_TOKEN_SECRET"),
      });

      if (!payload || !payload.sub) {
        throw new UnauthorizedException("توکن نامعتبر است");
      }

      return {
        sub: payload.sub,
      };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException("توکن منقضی شده است");
      } else if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException("توکن نامعتبر است");
      } else if (error instanceof NotBeforeError) {
        throw new UnauthorizedException("توکن هنوز معتبر نیست");
      } else {
        throw new UnauthorizedException("نیاز به احراز هویت دارد");
      }
    }
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    if (!token) {
      throw new UnauthorizedException("توکن ارسال نشده است");
    }

    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
      });

      if (!payload || !payload.sub) {
        throw new UnauthorizedException("توکن نامعتبر است");
      }
      const user = await this.findUserById(payload.sub);

      return {
        sub: user.id,
      };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException("توکن منقضی شده است");
      } else if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException("توکن نامعتبر است");
      } else if (error instanceof NotBeforeError) {
        throw new UnauthorizedException("توکن هنوز معتبر نیست");
      } else {
        throw new UnauthorizedException("نیاز به احراز هویت دارد");
      }
    }
  }

  async findUserById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException("کاربری با این مشخصات وجود ندارد.");

    return user;
  }
}
