import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";

interface FileValidationOptions {
  maxSize?: number; // bytes
  allowedTypes?: string[];
  isArray?: boolean;
}

@Injectable()
export class IconValidationPipe implements PipeTransform {
  private readonly maxSize: number;
  private readonly allowedTypes: string[];
  private readonly isArray: boolean;

  constructor(options?: FileValidationOptions) {
    this.maxSize = options?.maxSize ?? 1 * 1024 * 1024;
    this.allowedTypes = options?.allowedTypes ?? ["image/svg+xml", "image/png", "image/x-icon"];
    this.isArray = options?.isArray ?? false;
  }

  transform(file: Express.Multer.File | Express.Multer.File[], metadata: ArgumentMetadata) {
    if (!file) throw new BadRequestException("فیلد آیکون اجباری است");

    if (this.isArray) {
      const files = file as Express.Multer.File[];
      if (files.length === 0) {
        throw new BadRequestException("لیست آیکون خالی است");
      }
      files.forEach((file) => this.validateFile(file));
      return files;
    }

    return this.validateFile(file as Express.Multer.File);
  }

  private validateFile(file: Express.Multer.File): Express.Multer.File {
    if (file.size > this.maxSize) {
      throw new BadRequestException(
        `حجم آیکون نباید بیشتر از ${(this.maxSize / (1024 * 1024)).toFixed(1)} مگابایت باشد`,
      );
    }

    if (!this.allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `فرمت آیکون معتبر نیست. فقط ${this.allowedTypes.join(", ")} مجاز هستند`,
      );
    }

    return file;
  }
}
