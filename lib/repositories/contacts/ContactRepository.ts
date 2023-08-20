import { Contact } from "../../../types/contact";
import { Database } from "@/lib/database.types";

export type ContactFromDB = Database['public']['Tables']['contacts'];
export type ContactColumnName = string & keyof ContactFromDB['Row'];

export interface ContactRepository {
    getContacts(
        filters?: Map<ContactColumnName, unknown>,
        order?: {
            column: ContactColumnName,
            options?: { ascending?: boolean; nullsFirst?: boolean; foreignTable?: undefined }
        },
        paginationOptions?: { limit: number, offset: number},
        fetchCount?: boolean,
    ): Promise<{ rows: Contact[], itemsCount: number | null }>

    getTotalNumberOfContacts(filters?: Map<ContactColumnName, unknown>): Promise<number | null>
}

