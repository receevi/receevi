import { Contact } from "../../../types/contact";
import { Database } from "@/lib/database.types";

type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'like'
  | 'ilike'
  | 'is'
  | 'in'
  | 'cs'
  | 'cd'
  | 'sl'
  | 'sr'
  | 'nxl'
  | 'nxr'
  | 'adj'
  | 'ov'
  | 'fts'
  | 'plfts'
  | 'phfts'
  | 'wfts'

export type ContactFromDB = Database['public']['Tables']['contacts']['Row'];
export type ContactColumnName = string & keyof ContactFromDB;
export type ContactFilterArray = Array<{ column: ContactColumnName, operator: FilterOperator, value: unknown}>

export interface ContactRepository {
    getContacts(
        filters?: ContactFilterArray,
        order?: {
            column: ContactColumnName,
            options?: { ascending?: boolean; nullsFirst?: boolean; foreignTable?: undefined }
        },
        paginationOptions?: { limit: number, offset: number},
        fetchCount?: boolean,
    ): Promise<{ rows: Contact[], itemsCount: number | null }>

    getContactsHavingTag(tags: string[]): Promise<ContactFromDB[]>
}

