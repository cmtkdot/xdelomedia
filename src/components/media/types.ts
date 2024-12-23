import { Database } from "@/integrations/supabase/types";

export type MediaItem = Database['public']['Tables']['media']['Row'] & {
  metadata: {
    telegram_file_id: string;
    width: number;
    height: number;
    file_size: number;
  } | null;
};