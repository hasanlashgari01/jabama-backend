import { Controller } from "@nestjs/common";
import { AmenityService } from "../services/amenity.service";

@Controller("amenity")
export class AmenityController {
  constructor(private readonly amenityService: AmenityService) {}
}
