declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGODB_URI: string;
            JWT_SECRET_KEY: string;
            FACEBOOK_APP_SECRET: string;
            WHATSAPP_ACCESS_TOKEN: string;
            NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
            NEXT_PUBLIC_SUPABASE_URL: string;
        }
    }
}

export {}