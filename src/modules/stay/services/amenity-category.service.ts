import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateOptions } from "typeorm";
import { CreateAmenityCategoryDto, UpdateAmenityCategoryDto } from "../dto/amenity-category.dto";
import { AmenityCategory } from "../entities/amenity-category.entity";

@Injectable()
export class AmenityCategoryService {
  constructor(
    @InjectRepository(AmenityCategory)
    private amenityCategoryRepository: Repository<AmenityCategory>,
  ) {}

  async create(createAmenityCategoryDto: CreateAmenityCategoryDto) {
    const { name, description } = createAmenityCategoryDto;

    const category = await this.amenityCategoryRepository.findOneBy({ name });
    if (category) throw new ConflictException(`دسته بندی با عنوان ${name} وجود دارد`);

    const newAmenityCategory = await this.amenityCategoryRepository.create({
      name,
      description,
    });
    this.amenityCategoryRepository.save(newAmenityCategory);

    return {
      message: "دسته بندی با موفقیت ایجاد شد",
    };
  }

  async findByIdOrFail(id: number) {
    const category = await this.amenityCategoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException("دسته بندی مورد نظر یافت نشد");

    return category;
  }

  async update(id: number, updateAmenityCategoryDto: UpdateAmenityCategoryDto) {
    const amenityCategory = await this.findByIdOrFail(id);

    const { name, description } = updateAmenityCategoryDto;

    if (name) amenityCategory.name = name;
    if (description) amenityCategory.description = description;

    await this.amenityCategoryRepository.update(id, amenityCategory);

    return {
      message: "دسته بندی با موفقیت آپدیت شد",
    };
  }

  async remove(id: number) {
    await this.findByIdOrFail(id);

    const category = await this.amenityCategoryRepository.delete(id);
    if (category.affected === 0) throw new NotFoundException("دسته بندی مورد نظر یافت نشد");

    return {
      message: "دسته بندی با موفقیت حذف شد",
      category,
    };
  }
}
