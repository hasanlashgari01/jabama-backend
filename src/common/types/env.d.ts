namespace NodeJS {
    interface ProcessEnv {
        // Application
        PORT: number;
        // Database
        DB_PORT: number;
        DB_NAME: string;
        DB_HOST: string;
        DB_USERNAME: string;
        DB_PASSWORD: string;
        // Token
        ACCESS_TOKEN_SECRET: string;
        ACCESS_TOKEN_EXPIRE_IN: string;
        REFRESH_TOKEN_SECRET: string;
        REFRESH_TOKEN_EXPIRE_IN: string;
        // S3
        S3_SECRET_KEY: string;
        S3_ACCESS_KEY: string;
        S3_BUCKET_NAME: string;
        S3_ENDPOINT: string;
    }
}
