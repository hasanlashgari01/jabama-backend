import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Amenity } from "../entities/amenity.entity";
import { Repository } from "typeorm";

@Injectable()
export class AmenityService {
  constructor(@InjectRepository(Amenity) private amenityRepository: Repository<Amenity>) {}
}
