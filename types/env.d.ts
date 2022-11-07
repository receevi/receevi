declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGODB_URI: string;
            JWT_SECRET_KEY: string;
        }
    }
}

export {}