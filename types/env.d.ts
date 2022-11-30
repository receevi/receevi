declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGODB_URI: string;
            JWT_SECRET_KEY: string;
            FACEBOOK_APP_SECRET: string;
            WHATSAPP_ACCESS_TOKEN: string;
        }
    }
}

export {}