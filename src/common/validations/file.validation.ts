import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";

@Injectable()
export class FileValidationPipe implements PipeTransform {
    transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
        if (!file) {
            throw new BadRequestException("هیچ فایلی ارسال نشده است");
        }

        const maxSize = 1 * 1024 * 1024; // 1MB
        if (file.size > maxSize) {
            throw new BadRequestException("حجم فایل نباید بیشتر از 1 مگابایت باشد");
        }

        const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new BadRequestException(
                "فرمت فایل معتبر نیست. فقط PNG, JPG, JPEG, WEBP مجاز هستند",
            );
        }

        console.log(file);

        return file;
    }
}
