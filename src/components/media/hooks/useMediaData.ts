import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MediaItem } from "../types";
import { useToast } from "@/components/ui/use-toast";

const useMediaData = (selectedChannel: string, selectedType: string) => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMedia();
  }, [selectedChannel, selectedType]);

  const fetchMedia = async () => {
    try {
      console.log("Fetching media...");
      setIsLoading(true);
      let query = supabase
        .from('media')
        .select(`
          *,
          chat:channels(title, username)
        `)
        .order('created_at', { ascending: false });

      if (selectedChannel !== "all") {
        query = query.eq('chat_id', selectedChannel);
      }
      
      if (selectedType !== "all") {
        query = query.eq('media_type', selectedType);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      console.log("Fetched media data:", data);
      setMedia(data as MediaItem[]);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast({
        title: "Error",
        description: "Failed to load media gallery",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { media, setMedia, isLoading };
};

export default useMediaData;