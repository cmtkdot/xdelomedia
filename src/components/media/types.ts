import { Database } from "@/integrations/supabase/types";

export type MediaItem = Database['public']['Tables']['media']['Row'] & {
  metadata: {
    telegram_file_id: string;
    width: number;
    height: number;
    file_size: number;
    thumbnail_url?: string;
  } | null;
  chat?: {
    title: string;
    username: string;
  };
};

export type Channel = {
  title: string;
  chat_id: number;
};

export type MediaFilter = {
  selectedChannel: string;
  selectedType: string;
};