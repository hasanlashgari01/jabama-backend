import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Amenity } from "../entities/amenity.entity";
import { Repository } from "typeorm";
import { CreateAmenityDto } from "../dto/amenity.dto";
import { AmenityCategoryService } from "./amenity-category.service";

@Injectable()
export class AmenityService {
  constructor(
    @InjectRepository(Amenity) private amenityRepository: Repository<Amenity>,
    private amenityCategoryService: AmenityCategoryService,
  ) {}

  async create(createAmenityDto: CreateAmenityDto) {
    const { name, description, category_id } = createAmenityDto;

    await this.amenityCategoryService.findByIdOrFail(category_id);

    const category = await this.amenityRepository.findOneBy({ name });
    if (category) throw new ConflictException(`عنوان ${name} وجود دارد`);

    const newAmenity = await this.amenityRepository.create({
      name,
      description,
      category_id,
    });
    this.amenityRepository.save(newAmenity);

    return {
      message: "ویژگی با موفقیت ایجاد شد",
    };
  }
}
