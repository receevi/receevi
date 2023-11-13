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

export type ContactTagFromDB = Database['public']['Tables']['message_template']['Row'];
export type ContactTagColumnName = string & keyof ContactTagFromDB;
export type ContactTagFilterArray = Array<{ column: ContactTagColumnName, operator: FilterOperator, value: unknown}>

export interface ContactTagRepository {
  getContactTags(): Promise<string[]>
}

