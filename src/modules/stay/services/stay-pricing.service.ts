import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { StayPricing } from "../entities/stay-pricing.entity";
import { StayPricingDto } from "../dto/stay-pricing.dto";
import { Stay } from "../entities/stay.entity";
import { Request } from "express";

@Injectable()
export class StayPricingService {
  constructor(
    @InjectRepository(StayPricing)
    private pricingRepository: Repository<StayPricing>,
    @InjectRepository(Stay)
    private stayRepository: Repository<Stay>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async create(stayPricingDto: StayPricingDto) {
    const { sub } = this.request.user as UserPayload;
    if (!sub) throw new UnauthorizedException("فقط میزبان اقامتگاه می‌تواند قیمت اضافه کند");
    const { stayId, startDate, endDate, price, discountPrice } = stayPricingDto;

    const stay = await this.stayRepository.findOne({
      where: { id: stayId },
      relations: ["host"],
    });
    if (!stay) throw new NotFoundException("اقامتگاه یافت نشد");
    if (!stay.host || stay.host.id !== sub) {
      throw new UnauthorizedException("فقط میزبان اقامتگاه می‌تواند قیمت اضافه کند");
    }

    if (price < 0 || (discountPrice && discountPrice < 0)) {
      throw new BadRequestException("قیمت یا قیمت با تخفیف نمی‌تواند منفی باشد");
    }
    if (discountPrice && discountPrice >= price) {
      throw new BadRequestException("قیمت با تخفیف باید کمتر از قیمت اصلی باشد");
    }

    const effectiveEndDate = endDate ?? startDate;
    if (effectiveEndDate < startDate) {
      throw new BadRequestException("تاریخ پایان باید بعد از تاریخ شروع باشد");
    }

    const existingPricings = await this.pricingRepository.find({
      where: {
        stay: { id: stayId },
        date: Between(startDate, effectiveEndDate),
      },
    });
    if (existingPricings.length > 0) {
      throw new BadRequestException("قیمت برای برخی از تاریخ‌ها در این بازه قبلاً ثبت شده است");
    }

    const dateRange = this.getDateRange(startDate, effectiveEndDate);
    const pricings = dateRange.map((date) =>
      this.pricingRepository.create({
        date,
        price,
        discountPrice,
        stay,
      }),
    );

    await this.pricingRepository.save(pricings);

    return {
      message: "قیمت با موفقیت ثبت شد",
    };
  }

  private getDateRange(start: Date, end: Date): Date[] {
    const dates: Date[] = [];
    let currentDate = new Date(start);
    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }
}
