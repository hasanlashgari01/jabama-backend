import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ProvinceService } from "../province/province.service";
import { CreateCityDto } from "./dto/create-city.dto";
import { UpdateCityDto } from "./dto/update-city.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Province } from "../province/entities/province.entity";
import { City } from "./entities/city.entity";
import { DeepPartial, Repository } from "typeorm";
import { paginationGenerator, paginationSolver } from "src/common/validations/pagination.util";
import { SearchCityDto } from "./dto/search-city.dto";

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

  async findAll(searchCityDto: SearchCityDto) {
    const { page, limit, skip } = paginationSolver({
      page: searchCityDto.page,
      limit: searchCityDto.limit,
    });

    const qb = this.cityRepository.createQueryBuilder("city");

    if (searchCityDto.q) {
      const q = `%${searchCityDto.q.trim()}%`;
      qb.andWhere("(city.name ILIKE :q OR city.name_en ILIKE :q OR city.slug ILIKE :q)", { q });
    }

    const allowedSort = ["name", "created_at", "updated_at", "id", "slug"];
    let sort = "name";
    if (searchCityDto.sort && allowedSort.includes(searchCityDto.sort)) {
      sort = searchCityDto.sort;
    }
    const order: "ASC" | "DESC" = searchCityDto.order === "DESC" ? "DESC" : "ASC";
    qb.orderBy(`city.${sort}`, order as "ASC" | "DESC");

    qb.skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      pagination: paginationGenerator(total, page, limit),
    };
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

  async update(id: number, updateCityDto: UpdateCityDto) {
    const { name, name_en, slug, province_id, lat, lng } = updateCityDto;
    const updateObject: DeepPartial<City> = {};

    if (name_en) {
      const isExistEnglishName = await this.findOneByEnglishName(name_en);
      if (isExistEnglishName) throw new ConflictException("شهر مورد نظر وجود دارد");

      updateObject.name_en = name_en;
    }
    if (slug) {
      const isExistSlug = await this.findOneBySlug(slug);
      if (isExistSlug) throw new ConflictException("شهر مورد نظر وجود دارد");

      updateObject.slug = slug;
    }
    if (name) updateObject.name = name;
    if (province_id) updateObject.province_id = province_id;
    if (lat) updateObject.lat = lat;
    if (lng) updateObject.lng = lng;

    await this.cityRepository.update({ id }, updateObject);

    return {
      message: "شهر مورد نظر با موفقیت به روز رسانی شد",
    };
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
