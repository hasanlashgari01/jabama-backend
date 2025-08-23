import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAmenityDto, UpdateAmenityDto } from "../dto/amenity.dto";
import { Amenity } from "../entities/amenity.entity";
import { AmenityCategoryService } from "./amenity-category.service";

@Injectable()
export class AmenityService {
  constructor(
    @InjectRepository(Amenity) private amenityRepository: Repository<Amenity>,
    private amenityCategoryService: AmenityCategoryService,
  ) {}

  async create(createAmenityDto: CreateAmenityDto) {
    const { name, description, category_id } = createAmenityDto;

    const category = await this.amenityCategoryService.findByIdOrFail(category_id);

    const amenity = await this.amenityRepository.findOneBy({ name });
    if (amenity) throw new ConflictException(`عنوان ${name} وجود دارد`);

    const newAmenity = await this.amenityRepository.create({
      name,
      description,
      category,
    });
    this.amenityRepository.save(newAmenity);

    return {
      message: "ویژگی با موفقیت ایجاد شد",
    };
  }

  async getAmenities() {
    return this.amenityRepository.find({
      relations: ["category"],
      select: { id: true, name: true },
    });
  }

  async findByIdOrFail(id: number) {
    const category = await this.amenityRepository.findOneBy({ id });
    if (!category) throw new NotFoundException("دسته بندی مورد نظر یافت نشد");

    return category;
  }

  async update(id: number, updateAmenityDto: UpdateAmenityDto) {
    const amenity = await this.findByIdOrFail(id);
    const { name, description, category_id } = updateAmenityDto;

    if (name) {
      const isExist = await this.amenityRepository.findOneBy({ name });
      if (isExist && amenity.name !== name) throw new ConflictException("عنوان ویژگی قبلا ثبت شده");

      console.log(1);
      amenity.name = name;
    }
    if (description) amenity.description = description;
    if (category_id) {
      const amenityCategory = await this.amenityCategoryService.findByIdOrFail(category_id);
      amenity.category = amenityCategory;
    }

    await this.amenityRepository.update(id, amenity);

    return {
      message: "ویژگی با موفقیت آپدیت شد",
    };
  }

  async remove(id: number) {
    await this.findByIdOrFail(id);

    const amenity = await this.amenityRepository.delete(id);
    if (amenity.affected === 0) throw new NotFoundException("ویژگی مورد نظر یافت نشد");

    return {
      message: "ویژگی با موفقیت حذف شد",
      amenity,
    };
  }
}
