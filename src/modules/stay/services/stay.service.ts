import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateStayDto, UpdateStayDto } from "../dto/stay.dto";
import { Stay } from "../entities/stay.entity";
import { S3Service } from "../../s3/s3.service";
import { StayPhoto } from "../entities/stay-photo.entity";
import { v4 as uuidv4 } from "uuid";
import { StayAmenity } from "../entities/stay-amenity.entity";
import { Amenity } from "../entities/amenity.entity";

@Injectable()
export class StayService {
  constructor(
    @InjectRepository(Stay) private stayRepository: Repository<Stay>,
    @InjectRepository(StayPhoto) private stayPhotoRepository: Repository<StayPhoto>,
    @InjectRepository(Amenity) private amenityRepository: Repository<Amenity>,
    @InjectRepository(StayAmenity) private stayAmenityRepository: Repository<StayAmenity>,
    private s3Service: S3Service,
  ) {}

  async create(createStayDto: CreateStayDto, files: Array<Express.Multer.File>) {
    const {
      name,
      address,
      meterage,
      area,
      latitude,
      longitude,
      type,
      description,
      description_space,
      description_shared_space,
      description_additional,
      host_id,
      city_id,
      amenities,
    } = createStayDto;

    const newStay = await this.stayRepository.create({
      name,
      slug: this.generateUniqueSlug(),
      address,
      meterage,
      area,
      latitude,
      longitude,
      type,
      description,
      description_space,
      description_shared_space,
      description_additional,
      host_id,
      city_id,
    });
    if (!newStay) throw new ConflictException("");
    await this.stayRepository.save(newStay);

    await this.uploadFiles(newStay.id, files);

    if (amenities && amenities.length > 0) {
      for (const amenityDto of amenities) {
        const amenity = await this.amenityRepository.findOne({
          where: { id: amenityDto.id },
        });

        if (!amenity) continue;

        const stayAmenity = new StayAmenity();

        stayAmenity.stay = newStay;
        stayAmenity.amenity = amenity;
        stayAmenity.isAvailable = amenityDto.isAvailable ?? true;
        stayAmenity.isFree = amenityDto.isFree ?? false;
        stayAmenity.quantity = amenityDto.quantity == 0 ? amenityDto.quantity : 0;
        if (amenityDto.customDescription) {
          stayAmenity.customDescription = amenityDto.customDescription;
        }

        await this.stayAmenityRepository.save(stayAmenity);
      }
    }

    return {
      message: "اقامتگاه در حال بررسی است",
      stayId: newStay.id,
    };
  }

  findAll() {
    return `This action returns all stay`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stay`;
  }

  update(id: number, updateStayDto: UpdateStayDto) {
    return `This action updates a #${id} stay`;
  }

  remove(id: number) {
    return `This action removes a #${id} stay`;
  }

  generateUniqueSlug(): string {
    return uuidv4().split("-")[0];
  }

  async uploadFiles(stay_id: number, files: Array<Express.Multer.File>) {
    await Promise.all(
      files.map(async (file) => {
        const { Location, Key } = await this.s3Service.uploadFile(file, "images");

        await this.stayPhotoRepository.create({
          url: Location,
          key: Key,
          stay_id,
        });
      }),
    );
  }
}
