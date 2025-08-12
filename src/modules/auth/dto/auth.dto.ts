import { IsMobilePhone, Length } from "class-validator";

export class SendCodeDto {
    @IsMobilePhone("fa-IR")
    mobile: string;
}

export class ValidateCodeDto extends SendCodeDto {
    @Length(4, 4)
    code: string;
}
