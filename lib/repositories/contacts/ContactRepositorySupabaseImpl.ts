import { DBTables } from "@/lib/enums/Tables";
import { createClient as createBrowserClient } from "@/utils/supabase-browser";
import { Contact } from "../../../types/contact";
import { ContactColumnName, ContactRepository } from "./ContactRepository";

type SupabaseClientType = ReturnType<typeof createBrowserClient>

export class ContactRepositorySupabaseImpl implements ContactRepository {
    private client;
    constructor(client: SupabaseClientType) {
        this.client = client;
    }
    async getContacts(
        filters?: Map<ContactColumnName, unknown>,
        order?: {
            column: ContactColumnName,
            options?: { ascending?: boolean; nullsFirst?: boolean; foreignTable?: undefined }
        },
        paginationOptions?: { limit: number, offset: number },
        fetchCount?: boolean,
    ): Promise<{ rows: Contact[], itemsCount: number | null }> {
        let selectOptions = {}
        if (fetchCount) {
            selectOptions = { count: 'exact' }
        }
        let query = this.client
            .from(DBTables.Contacts)
            .select('*', selectOptions)
        if (filters) {
            for (const [key, value] of filters) {
                query = query.eq(key, value)
            }
        }
        if (order) {
            query = query.order(order.column, order.options)
        }
        if (paginationOptions) {
            const from = paginationOptions.offset
            const to = from + paginationOptions.limit - 1
            query.range(from, to)
        }
        const result = await query
        if (result.error) throw result.error
        return {
            rows: result.data,
            itemsCount: result.count,
        }
    }

    async getTotalNumberOfContacts(filters?: Map<ContactColumnName, unknown>): Promise<number | null> {
        let query = this.client
            .from(DBTables.Contacts)
            .select('wa_id', { count: 'exact', head: true })
        if (filters) {
            for (const [key, value] of filters) {
                query = query.eq(key, value)
            }
        }
        const result = await query
        if (result.error) throw result.error
        return result.count
    }
}