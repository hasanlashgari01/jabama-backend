import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    async findByMobile(mobile_number: string, showError: boolean = true) {
        const user = this.userRepository.findOneBy({ mobile_number });
        if (showError && !user) throw new NotFoundException("کاربر مورد نظر پیدا نشد");

        return user;
    }
}
