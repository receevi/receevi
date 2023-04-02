export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      configuration: {
        Row: {
          created_at: string
          key: string
          value: string
        }
        Insert: {
          created_at?: string
          key: string
          value: string
        }
        Update: {
          created_at?: string
          key?: string
          value?: string
        }
      }
      contacts: {
        Row: {
          created_at: string | null
          last_message_at: string | null
          profile_name: string | null
          wa_id: number
        }
        Insert: {
          created_at?: string | null
          last_message_at?: string | null
          profile_name?: string | null
          wa_id: number
        }
        Update: {
          created_at?: string | null
          last_message_at?: string | null
          profile_name?: string | null
          wa_id?: number
        }
      }
      messages: {
        Row: {
          created_at: string
          from: number
          id: number
          media_url: string | null
          message: Json
          wam_id: string
        }
        Insert: {
          created_at?: string
          from: number
          id?: number
          media_url?: string | null
          message: Json
          wam_id: string
        }
        Update: {
          created_at?: string
          from?: number
          id?: number
          media_url?: string | null
          message?: Json
          wam_id?: string
        }
      }
      webhook: {
        Row: {
          created_at: string | null
          id: number
          payload: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          payload?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: number
          payload?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
