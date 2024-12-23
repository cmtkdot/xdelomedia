import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MediaItem } from "../types";

const useMediaSubscription = (
  setMedia: React.Dispatch<React.SetStateAction<MediaItem[]>>,
  toast: any
) => {
  useEffect(() => {
    console.log("Setting up realtime subscription");
    const subscription = supabase
      .channel('media_changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'media' 
      }, async (payload) => {
        console.log('New media received:', payload);
        const newMedia = payload.new as MediaItem;
        
        const { data: completeMedia } = await supabase
          .from('media')
          .select(`
            *,
            chat:channels(title, username)
          `)
          .eq('id', newMedia.id)
          .single();

        if (completeMedia) {
          setMedia(prev => [completeMedia as MediaItem, ...prev]);
          toast({
            title: "New Media Received",
            description: completeMedia.caption || "New media file has been added",
          });
        }
      })
      .subscribe();

    return () => {
      console.log("Cleaning up subscription");
      subscription.unsubscribe();
    };
  }, [setMedia, toast]);
};

export default useMediaSubscription;