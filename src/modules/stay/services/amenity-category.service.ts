import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AmenityCategory } from "../entities/amenity-category.entity";
import { CreateAmenityCategoryDto } from "../dto/amenity-category.dto";

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
}
