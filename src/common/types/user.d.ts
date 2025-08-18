interface UserPayload {
    sub: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}
