import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ProvinceService } from "../province/province.service";
import { CreateCityDto } from "./dto/create-city.dto";
import { UpdateCityDto } from "./dto/update-city.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Province } from "../province/entities/province.entity";
import { City } from "./entities/city.entity";
import { Repository } from "typeorm";

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City) private readonly cityRepository: Repository<City>,
    private provinceSerivce: ProvinceService,
  ) {}

  async create(createCityDto: CreateCityDto) {
    const { name, name_en, slug, province_id, lat, lng } = createCityDto;

    const existProvince = await this.provinceSerivce.findOneById(province_id);
    if (!existProvince) throw new NotFoundException("استان مورد نظر یافت نشد");
    const isExistEnglishName = await this.findOneByEnglishName(name_en);
    const isExistSlug = await this.findOneBySlug(slug);
    if (isExistEnglishName || isExistSlug) throw new ConflictException("استان مورد نظر وجود دارد");

    await this.cityRepository.insert({
      name,
      name_en,
      slug,
      province_id,
      lat,
      lng,
    });

    return {
      message: "شهر جدید با موفقیت ایجاد شد",
    };
  }

  findAll() {
    return `This action returns all city`;
  }

  async findOneById(id: number) {
    const province = await this.cityRepository.findOne({
      where: {
        id,
      },
    });

    return province;
  }

  async findOneBySlug(slug: string) {
    const province = await this.cityRepository.findOne({
      where: {
        slug,
      },
    });

    return province;
  }

  async findOneByEnglishName(enName: string) {
    const province = await this.cityRepository.findOne({
      where: {
        name_en: enName.trim(),
      },
    });

    return province;
  }

  update(id: number, updateCityDto: UpdateCityDto) {
    return `This action updates a #${id} city`;
  }

  async remove(id: number) {
    const city = await this.findOneById(id);
    if (!city) throw new NotFoundException("شهر مورد نظر پیدا نشد");
    await this.cityRepository.remove(city);

    return {
      message: "شهر مورد نظر با موفقیت حذف شد",
    };
  }
}
