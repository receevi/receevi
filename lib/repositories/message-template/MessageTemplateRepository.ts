import { MessageTemplate } from "@/types/message-template";
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

export type MessageTemplateFromDB = Database['public']['Tables']['message_template']['Row'];
export type MessageTemplateColumnName = string & keyof MessageTemplateFromDB;
export type MessageTemplateFilterArray = Array<{ column: MessageTemplateColumnName, operator: FilterOperator, value: unknown}>

export interface MessageTemplateRepository {
    getMessageTemplateUniqueNames(): Promise<string[]>
    getMessageTemplateLanguages(messageTemplateName: string): Promise<string[]>
}

