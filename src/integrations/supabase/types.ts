export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bot_activities: {
        Row: {
          chat_id: number
          created_at: string | null
          details: Json | null
          event_type: string
          id: string
          message_id: number | null
          user_id: string | null
        }
        Insert: {
          chat_id: number
          created_at?: string | null
          details?: Json | null
          event_type: string
          id?: string
          message_id?: number | null
          user_id?: string | null
        }
        Update: {
          chat_id?: number
          created_at?: string | null
          details?: Json | null
          event_type?: string
          id?: string
          message_id?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      bot_users: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          telegram_user_id: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          telegram_user_id?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          telegram_user_id?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      channels: {
        Row: {
          chat_id: number
          created_at: string | null
          id: string
          is_active: boolean | null
          title: string
          updated_at: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          chat_id: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          chat_id?: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      media: {
        Row: {
          caption: string | null
          chat_id: number | null
          created_at: string | null
          file_name: string
          file_url: string
          id: string
          media_type: string | null
          metadata: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          caption?: string | null
          chat_id?: number | null
          created_at?: string | null
          file_name: string
          file_url: string
          id?: string
          media_type?: string | null
          metadata?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          caption?: string | null
          chat_id?: number | null
          created_at?: string | null
          file_name?: string
          file_url?: string
          id?: string
          media_type?: string | null
          metadata?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["chat_id"]
          },
        ]
      }
      media_tags: {
        Row: {
          created_at: string | null
          media_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string | null
          media_id: string
          tag_id: string
        }
        Update: {
          created_at?: string | null
          media_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_tags_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          chat_id: number | null
          created_at: string | null
          id: string
          media_type: string | null
          media_url: string | null
          message_id: number
          sender_name: string
          text: string | null
          user_id: string
        }
        Insert: {
          chat_id?: number | null
          created_at?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          message_id: number
          sender_name: string
          text?: string | null
          user_id: string
        }
        Update: {
          chat_id?: number | null
          created_at?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          message_id?: number
          sender_name?: string
          text?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["chat_id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_media_tags: {
        Args: {
          p_media_id: string
          p_tags: string[]
        }
        Returns: {
          created_at: string | null
          media_id: string
          tag_id: string
        }[]
      }
      upload_media: {
        Args: {
          p_user_id: string
          p_chat_id: number
          p_file_name: string
          p_media_type: string
          p_caption?: string
        }
        Returns: string
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
