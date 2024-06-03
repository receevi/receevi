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

export type BroadcastFromDB = Database['public']['Tables']['broadcast']['Row'];
export type BroadcastColumnName = string & keyof BroadcastFromDB;
export type BroadcastFilterArray = Array<{ column: BroadcastColumnName, operator: FilterOperator, value: unknown}>

export interface BroadcastRepository {
  getAllBroadcasts(page: number): Promise<BroadcastFromDB[]>
}

