export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      contacts: {
        Row: {
          created_at: string | null
          in_chat: boolean
          last_message_at: string | null
          profile_name: string | null
          wa_id: number
        }
        Insert: {
          created_at?: string | null
          in_chat?: boolean
          last_message_at?: string | null
          profile_name?: string | null
          wa_id: number
        }
        Update: {
          created_at?: string | null
          in_chat?: boolean
          last_message_at?: string | null
          profile_name?: string | null
          wa_id?: number
        }
        Relationships: []
      }
      message_template: {
        Row: {
          category: string | null
          components: Json | null
          created_at: string | null
          id: string
          language: string | null
          name: string | null
          previous_category: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          components?: Json | null
          created_at?: string | null
          id: string
          language?: string | null
          name?: string | null
          previous_category?: string | null
          status?: string | null
          updated_at?: string | null | Date
        }
        Update: {
          category?: string | null
          components?: Json | null
          created_at?: string | null
          id?: string
          language?: string | null
          name?: string | null
          previous_category?: string | null
          status?: string | null
          updated_at?: string | null | Date
        }
        Relationships: []
      }
      messages: {
        Row: {
          chat_id: number
          created_at: string
          id: number
          media_url: string | null
          message: Json
          wam_id: string
        }
        Insert: {
          chat_id: number
          created_at?: string
          id?: number
          media_url?: string | null
          message: Json
          wam_id: string
        }
        Update: {
          chat_id?: number
          created_at?: string
          id?: number
          media_url?: string | null
          message?: Json
          wam_id?: string
        }
        Relationships: []
      }
      setup: {
        Row: {
          created_at: string | null
          display_text: string | null
          done_at: string | null
          id: string
          in_progress: boolean
          name: string | null
          sequence: number | null
        }
        Insert: {
          created_at?: string | null
          display_text?: string | null
          done_at?: string | null | Date
          id?: string
          in_progress?: boolean
          name?: string | null
          sequence?: number | null
        }
        Update: {
          created_at?: string | null
          display_text?: string | null
          done_at?: string | null | Date
          id?: string
          in_progress?: boolean
          name?: string | null
          sequence?: number | null
        }
        Relationships: []
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
        Relationships: []
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
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

