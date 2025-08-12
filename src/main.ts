import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app/app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { SwaggerConfigInit } from "./configs/swagger.config";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const PORT = process.env.PORT || 3000;

    SwaggerConfigInit(app);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    await app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`);
        console.log(`http://localhost:${PORT}/swagger`);
    });
}
await bootstrap();
