import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { paginationGenerator, paginationSolver } from "src/common/validations/pagination.util";
import { DeepPartial, Repository } from "typeorm";
import { CreateProvinceDto } from "./dto/create-province.dto";
import { SearchProvinceDto } from "./dto/search-province.dto";
import { UpdateProvinceDto } from "./dto/update-province.dto";
import { Province } from "./entities/province.entity";

@Injectable()
export class ProvinceService {
  constructor(
    @InjectRepository(Province) private readonly provinceRepository: Repository<Province>,
  ) {}

  async create(createProvinceDto: CreateProvinceDto) {
    const { name, name_en, slug } = createProvinceDto;

    const isExistEnglishName = await this.findOneByEnglishName(name_en);
    const isExistSlug = await this.findOneBySlug(slug);
    if (isExistEnglishName || isExistSlug) throw new ConflictException("استان مورد نظر وجود دارد");

    await this.provinceRepository.insert({
      name,
      name_en,
      slug,
    });

    return {
      message: "استان جدید با موفقیت ایجاد شد",
    };
  }

  async findAll(searchProvinceDto: SearchProvinceDto) {
    const { page, limit, skip } = paginationSolver({
      page: searchProvinceDto.page,
      limit: searchProvinceDto.limit,
    });

    const qb = this.provinceRepository.createQueryBuilder("province");

    if (searchProvinceDto.q) {
      const q = `%${searchProvinceDto.q.trim()}%`;
      qb.andWhere(
        "(province.name ILIKE :q OR province.name_en ILIKE :q OR province.slug ILIKE :q)",
        { q },
      );
    }

    const allowedSort = ["name", "created_at", "updated_at", "id", "slug"];
    let sort = "name";
    if (searchProvinceDto.sort && allowedSort.includes(searchProvinceDto.sort)) {
      sort = searchProvinceDto.sort;
    }
    const order: "ASC" | "DESC" = searchProvinceDto.order === "DESC" ? "DESC" : "ASC";
    qb.orderBy(`province.${sort}`, order as "ASC" | "DESC");

    qb.skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      pagination: paginationGenerator(total, page, limit),
    };
  }

  async findOneById(id: number) {
    const province = await this.provinceRepository.findOne({
      where: {
        id,
      },
    });

    return province;
  }

  async findOneBySlug(slug: string) {
    const province = await this.provinceRepository.findOne({
      where: {
        slug,
      },
    });

    return province;
  }

  async findOneByEnglishName(enName: string) {
    const province = await this.provinceRepository.findOne({
      where: {
        name_en: enName.trim(),
      },
    });

    return province;
  }

  async update(id: number, updateProvinceDto: UpdateProvinceDto) {
    const { name, name_en, slug } = updateProvinceDto;
    const updateObject: DeepPartial<Province> = {};

    if (name_en) {
      const isExistEnglishName = await this.findOneByEnglishName(name_en);
      if (isExistEnglishName) throw new ConflictException("استان مورد نظر وجود دارد");

      updateObject.name_en = name_en;
    }
    if (slug) {
      const isExistSlug = await this.findOneBySlug(slug);
      if (isExistSlug) throw new ConflictException("استان مورد نظر وجود دارد");

      updateObject.slug = slug;
    }
    if (name) updateObject.name = name;

    await this.provinceRepository.update({ id }, updateObject);

    return {
      message: "استان مورد نظر با موفقیت به روز رسانی شد",
    };
  }

  async remove(id: number) {
    const province = await this.findOneById(id);
    if (!province) throw new NotFoundException("استان مورد نظر پیدا نشد");
    await this.provinceRepository.remove(province);

    return {
      message: "استان مورد نظر با موفقیت حذف شد",
    };
  }
}
