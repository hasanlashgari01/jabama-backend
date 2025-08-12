import { IsMobilePhone } from "class-validator";

export class SendCodeDto {
    @IsMobilePhone("fa-IR")
    mobile: string;
}
