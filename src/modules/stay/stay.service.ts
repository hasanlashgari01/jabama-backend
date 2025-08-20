import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateStayDto } from "./dto/create-stay.dto";
import { UpdateStayDto } from "./dto/update-stay.dto";
import { Stay } from "./entities/stay.entity";

@Injectable()
export class StayService {
  constructor(@InjectRepository(Stay) private stayRepository: Repository<Stay>) {}

  create(createStayDto: CreateStayDto) {
    return "This action adds a new stay";
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
}
