import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsMobilePhone, IsString, Length } from "class-validator";

export class SendCodeDto {
    @ApiProperty({ example: "" })
    @IsMobilePhone("fa-IR")
    mobile: string;
}

export class ValidateCodeDto extends SendCodeDto {
    @ApiProperty({ example: "" })
    @IsString()
    @Length(4, 4)
    code: string;
}
