export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          failed_count: number
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
          failed_count?: number
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
          failed_count?: number
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
          ended_at?: string | null
          id: string
          scheduled_count: number
          sent_count?: number
          started_at?: string | null
          status?: string | null
        }
        Update: {
          broadcast_id?: string
          created_at?: string
          ended_at?: string | null
          id?: string
          scheduled_count?: number
          sent_count?: number
          started_at?: string | null
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
          failed_at: string | null
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
          failed_at?: string | null
          id?: string
          processed_at?: string | null
          read_at?: string | null
          replied_at?: string | null
          reply_counted?: boolean
          sent_at?: string | null
          wam_id?: string | null
        }
        Update: {
          batch_id?: string
          broadcast_id?: string
          contact_id?: number
          created_at?: string
          delivered_at?: string | null
          failed_at?: string | null
          id?: string
          processed_at?: string | null
          read_at?: string | null
          replied_at?: string | null
          reply_counted?: boolean
          sent_at?: string | null
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
          assigned_to: string | null
          created_at: string | null
          in_chat: boolean
          last_message_at: string | null
          last_message_received_at: string | null
          profile_name: string | null
          tags: string[] | null
          unread_count: number | null
          wa_id: number
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          in_chat?: boolean
          last_message_at?: string | null | Date
          last_message_received_at?: string | null | Date
          profile_name?: string | null
          tags?: string[] | null
          unread_count?: number | null
          wa_id: number
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          in_chat?: boolean
          last_message_at?: string | null | Date
          last_message_received_at?: string | null | Date
          profile_name?: string | null
          tags?: string[] | null
          unread_count?: number | null
          wa_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "contacts_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
          failed_at: string | null | Date
          id: number
          is_received: boolean
          media_url: string | null
          message: Json
          read_at: string | null
          read_by_user_at: string | null
          sent_at: string | null
          wam_id: string
        }
        Insert: {
          chat_id: number
          created_at?: string
          delivered_at?: string | null | Date
          failed_at?: string | null | Date
          id?: number
          is_received?: boolean
          media_url?: string | null
          message: Json
          read_at?: string | null | Date
          read_by_user_at?: string | null | Date
          sent_at?: string | null | Date
          wam_id: string
        }
        Update: {
          chat_id?: number
          created_at?: string
          delivered_at?: string | null | Date
          failed_at?: string | null | Date
          id?: number
          is_received?: boolean
          media_url?: string | null
          message?: Json
          read_at?: string | null | Date
          read_by_user_at?: string | null | Date
          sent_at?: string | null | Date
          wam_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
        }
        Insert: {
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
        }
        Update: {
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          id: number
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          id?: number
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          id?: number
          permission?: Database["public"]["Enums"]["app_permission"]
          role?: Database["public"]["Enums"]["app_role"]
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
      user_roles: {
        Row: {
          id: number
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: number
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: number
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
      add_failed_count_to_broadcast: {
        Args: {
          b_id: string
          failed_count_to_be_added: number
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
      authorize: {
        Args: {
          requested_permission: Database["public"]["Enums"]["app_permission"]
        }
        Returns: boolean
      }
      custom_access_token_hook: {
        Args: {
          event: Json
        }
        Returns: Json
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
      update_message_failed_status: {
        Args: {
          wam_id_in: string
          failed_at_in: string
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
      app_permission:
        | "contact.read"
        | "contact.write"
        | "chat.read"
        | "chat.write"
      app_role: "admin" | "agent"
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
          owner_id: string | null
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
          owner_id?: string | null
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
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
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
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
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
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
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
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
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
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

