import { ApiPropertyOptional } from "@nestjs/swagger";
import {
    IsDateString,
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    Length,
    Matches,
    MaxLength,
} from "class-validator";
import { Gender } from "../enum/user.enum";

export class ProfileDto {
    @ApiPropertyOptional({ type: "string", format: "binary", required: false })
    @IsOptional()
    avatar: Express.Multer.File;

    @ApiPropertyOptional({ default: "" })
    @IsOptional()
    @IsString()
    @MaxLength(30)
    first_name: string;

    @ApiPropertyOptional({ default: "" })
    @IsOptional()
    @IsString()
    @MaxLength(30)
    last_name: string;

    @ApiPropertyOptional({ default: "" })
    @IsOptional()
    @IsString()
    email: string;

    @ApiPropertyOptional({ default: "" })
    @IsOptional()
    @IsString()
    // @Matches(/^\d{10}$/, { message: "کد ملی باید ۱۰ رقم باشد" })
    national_code: string;

    @ApiPropertyOptional({ type: String, format: "date", default: "" })
    @IsOptional()
    birthday?: Date;

    @ApiPropertyOptional({ default: "" })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    bio?: string;

    @ApiPropertyOptional({ enum: Gender, example: Gender.MALE })
    @IsOptional()
    @IsEnum(Gender)
    gender: Gender;
}
