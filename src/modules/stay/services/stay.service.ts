import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { City } from "src/modules/city/entities/city.entity";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { S3Service } from "../../s3/s3.service";
import { AmenityItemDto, CreateStayDto, UpdateStayDto } from "../dto/stay.dto";
import { Amenity } from "../entities/amenity.entity";
import { StayAmenity } from "../entities/stay-amenity.entity";
import { StayPhoto } from "../entities/stay-photo.entity";
import { Stay } from "../entities/stay.entity";

@Injectable()
export class StayService {
  constructor(
    @InjectRepository(Stay) private stayRepository: Repository<Stay>,
    @InjectRepository(StayPhoto) private stayPhotoRepository: Repository<StayPhoto>,
    @InjectRepository(Amenity) private amenityRepository: Repository<Amenity>,
    @InjectRepository(StayAmenity) private stayAmenityRepository: Repository<StayAmenity>,
    @InjectRepository(City) private cityRepository: Repository<City>,
    @Inject(REQUEST) private readonly request: Request,
    private s3Service: S3Service,
  ) {}

  async create(createStayDto: CreateStayDto, files: Express.Multer.File[]): Promise<Stay> {
    const { sub } = this.request?.user as UserPayload;
    const { city_id, amenities, images, ...stayData } = createStayDto;

    const city = await this.cityRepository.findOne({ where: { id: city_id } });
    if (!city) throw new NotFoundException("شهر مورد نظر پیدا نشد");

    const stay = this.stayRepository.create({
      ...stayData,
      slug: this.generateUniqueSlug(),
      city,
      city_id,
      host_id: sub,
    });

    const savedStay = await this.stayRepository.save(stay);

    if (amenities && amenities.length > 0) {
      const stayAmenities = await Promise.all(
        amenities.map(async (amenity: AmenityItemDto) => {
          const existingAmenity = await this.amenityRepository.findOne({
            where: { id: amenity.amenity_id },
          });
          if (!existingAmenity) {
            throw new NotFoundException(`Amenity with ID ${amenity.amenity_id} not found`);
          }
          return this.stayAmenityRepository.create({
            stay: savedStay,
            amenity: existingAmenity,
            is_available: amenity.isAvailable ?? true,
            is_free: amenity.isFree ?? false,
            quantity: amenity.quantity,
            custom_description: amenity.customDescription,
          });
        }),
      );
      await this.stayAmenityRepository.save(stayAmenities);
      savedStay.stayAmenities = stayAmenities;
    }

    if (files && files.length > 0) {
      const uploadedPhotos = await this.uploadFiles(savedStay.id, files);
      savedStay.photos = uploadedPhotos;
    }

    return savedStay;
  }

  findAll() {
    return this.stayRepository.find();
  }

  findOne(id: number) {
    return this.stayRepository.findOne({
      where: { id },
      relations: [
        "host",
        "city",
        "stayAmenities",
        "stayAmenities.amenity",
        "photos",
        "reviews",
        "pricings",
        "availabilities",
        "bookings",
      ],
    });
  }

  update(id: number, updateStayDto: UpdateStayDto) {
    return `This action updates a #${id} stay`;
  }

  remove(id: number) {
    return `This action removes a #${id} stay`;
  }

  getAmenities(stayId: number) {
    return this.stayAmenityRepository.find({
      where: {
        stayId,
      },
      relations: ["amenity", "amenity.category"],
    });
  }

  generateUniqueSlug(): string {
    return uuidv4().split("-")[0];
  }

  async uploadFiles(stay_id: number, files: Array<Express.Multer.File>): Promise<StayPhoto[]> {
    const stay = await this.stayRepository.findOne({ where: { id: stay_id } });
    if (!stay) throw new NotFoundException(`Stay with ID ${stay_id} not found`);

    const stayPhotos = await this.stayRepository.manager.transaction(async (manager) => {
      const stayPhotoRepo = manager.getRepository(StayPhoto);
      const uploadedPhotos: StayPhoto[] = [];

      await Promise.all(
        files.map(async (file) => {
          try {
            const { Location, Key } = await this.s3Service.uploadFile(file, "images");
            const stayPhoto = await this.stayPhotoRepository.create({
              url: Location,
              key: Key,
              stay_id,
              stay,
            });
            const savedPhoto = await stayPhotoRepo.save(stayPhoto);
            uploadedPhotos.push(savedPhoto);
          } catch (error) {
            throw new Error(`Failed to upload file ${file.originalname}: ${error.message}`);
          }
        }),
      );

      return uploadedPhotos;
    });

    return stayPhotos;
  }
}
