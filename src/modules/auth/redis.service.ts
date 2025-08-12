import { Injectable, OnModuleDestroy, OnModuleInit, UnauthorizedException } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: Redis;

    onModuleInit() {
        this.client = new Redis({
            host: process.env.REDIS_HOST || "localhost",
            port: Number(process.env.REDIS_PORT) || 6379,
            password: process.env.REDIS_PASSWORD || undefined,
        });
    }

    async onModuleDestroy() {
        await this.client.quit();
    }

    async setValue(key: string, value: string, expire: number) {
        const client = this.client;

        await client.set(key, value, "EX", expire);
    }

    async getValue(key: string, msg?: string): Promise<string> {
        const value = await this.client.get(key);
        if (!value) throw new UnauthorizedException(msg || `${key} not found`);

        return value;
    }
}
