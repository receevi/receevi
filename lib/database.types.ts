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
      broadcast: {
        Row: {
          contact_tags: string[] | null
          created_at: string
          delivered_count: number
          id: string
          language: string
          name: string
          processed_count: number
          read_count: number
          replied_count: number
          scheduled_count: number | null
          sent_count: number
          template_name: string
        }
        Insert: {
          contact_tags?: string[] | null
          created_at?: string
          delivered_count?: number
          id?: string
          language: string
          name: string
          processed_count?: number
          read_count?: number
          replied_count?: number
          scheduled_count?: number | null
          sent_count?: number
          template_name: string
        }
        Update: {
          contact_tags?: string[] | null
          created_at?: string
          delivered_count?: number
          id?: string
          language?: string
          name?: string
          processed_count?: number
          read_count?: number
          replied_count?: number
          scheduled_count?: number | null
          sent_count?: number
          template_name?: string
        }
        Relationships: []
      }
      broadcast_batch: {
        Row: {
          broadcast_id: string
          created_at: string
          ended_at: string | null
          id: string
          scheduled_count: number
          sent_count: number
          started_at: string | null
          status: string | null
        }
        Insert: {
          broadcast_id: string
          created_at?: string
          ended_at?: string | null | Date
          id: string
          scheduled_count: number
          sent_count?: number
          started_at?: string | null | Date
          status?: string | null
        }
        Update: {
          broadcast_id?: string
          created_at?: string
          ended_at?: string | null | Date
          id?: string
          scheduled_count?: number
          sent_count?: number
          started_at?: string | null | Date
          status?: string | null
        }
        Relationships: []
      }
      broadcast_contact: {
        Row: {
          batch_id: string
          broadcast_id: string
          contact_id: number
          created_at: string
          delivered_at: string | null
          id: string
          processed_at: string | null
          read_at: string | null
          replied_at: string | null
          reply_counted: boolean
          sent_at: string | null
          wam_id: string | null
        }
        Insert: {
          batch_id: string
          broadcast_id: string
          contact_id: number
          created_at?: string
          delivered_at?: string | null
          id?: string
          processed_at?: string | null
          read_at?: string | null
          replied_at?: string | null
          reply_counted?: boolean
          sent_at?: string | null | Date
          wam_id?: string | null
        }
        Update: {
          batch_id?: string
          broadcast_id?: string
          contact_id?: number
          created_at?: string
          delivered_at?: string | null
          id?: string
          processed_at?: string | null | Date
          read_at?: string | null
          replied_at?: string | null
          reply_counted?: boolean
          sent_at?: string | null | Date
          wam_id?: string | null
        }
        Relationships: []
      }
      contact_tag: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          created_at: string | null
          in_chat: boolean
          last_message_at: string | null
          profile_name: string | null
          tags: string[] | null
          wa_id: number
        }
        Insert: {
          created_at?: string | null
          in_chat?: boolean
          last_message_at?: string | null
          profile_name?: string | null
          tags?: string[] | null
          wa_id: number
        }
        Update: {
          created_at?: string | null
          in_chat?: boolean
          last_message_at?: string | null
          profile_name?: string | null
          tags?: string[] | null
          wa_id?: number
        }
        Relationships: []
      }
      message_template: {
        Row: {
          category: string
          components: Json
          created_at: string
          id: string
          language: string
          name: string
          previous_category: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          category: string
          components: Json
          created_at?: string
          id: string
          language: string
          name: string
          previous_category?: string | null
          status?: string | null
          updated_at?: string | Date
        }
        Update: {
          category?: string
          components?: Json
          created_at?: string
          id?: string
          language?: string
          name?: string
          previous_category?: string | null
          status?: string | null
          updated_at?: string | Date
        }
        Relationships: []
      }
      messages: {
        Row: {
          chat_id: number
          created_at: string
          delivered_at: string | null
          id: number
          media_url: string | null
          message: Json
          read_at: string | null
          sent_at: string | null
          wam_id: string
        }
        Insert: {
          chat_id: number
          created_at?: string
          delivered_at?: string | null | Date
          id?: number
          media_url?: string | null
          message: Json
          read_at?: string | null | Date
          sent_at?: string | null | Date
          wam_id: string
        }
        Update: {
          chat_id?: number
          created_at?: string
          delivered_at?: string | null | Date
          id?: number
          media_url?: string | null
          message?: Json
          read_at?: string | null | Date
          sent_at?: string | null | Date
          wam_id?: string
        }
        Relationships: []
      }
      setup: {
        Row: {
          created_at: string | null
          display_text: string
          done_at: string | null
          id: string
          in_progress: boolean
          name: string | null
          sequence: number | null
        }
        Insert: {
          created_at?: string | null
          display_text: string
          done_at?: string | null | Date
          id?: string
          in_progress?: boolean
          name?: string | null
          sequence?: number | null
        }
        Update: {
          created_at?: string | null
          display_text?: string
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
      add_delivered_count_to_broadcast: {
        Args: {
          b_id: string
          delivered_count_to_be_added: number
        }
        Returns: undefined
      }
      add_processed_count_to_broadcast: {
        Args: {
          b_id: string
          processed_count_to_be_added: number
        }
        Returns: undefined
      }
      add_read_count_to_broadcast: {
        Args: {
          b_id: string
          read_count_to_be_added: number
        }
        Returns: undefined
      }
      add_replied_to_broadcast_contact: {
        Args: {
          b_id: string
          replied_count_to_be_added: number
        }
        Returns: undefined
      }
      add_sent_count_to_broadcast: {
        Args: {
          b_id: string
          sent_count_to_be_added: number
        }
        Returns: undefined
      }
      pick_next_broadcast_batch: {
        Args: {
          b_id: string
        }
        Returns: string
      }
      update_message_delivered_status: {
        Args: {
          delivered_at_in: string
          wam_id_in: string
        }
        Returns: boolean
      }
      update_message_read_status: {
        Args: {
          wam_id_in: string
          read_at_in: string
        }
        Returns: boolean
      }
      update_message_sent_status: {
        Args: {
          wam_id_in: string
          sent_at_in: string
        }
        Returns: boolean
      }
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

