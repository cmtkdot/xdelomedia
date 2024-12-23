import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { MediaItem, Channel } from "./types";
import MediaCard from "./MediaCard";
import MediaFilters from "./MediaFilters";
import WebhookInterface from "../webhook/WebhookInterface";
import MediaGallerySkeleton from "./MediaGallerySkeleton";
import useMediaSubscription from "./hooks/useMediaSubscription";
import useMediaData from "./hooks/useMediaData";

const MediaGallery = () => {
  const [selectedChannel, setSelectedChannel] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [channels, setChannels] = useState<Channel[]>([]);
  const { toast } = useToast();
  const { media, setMedia, isLoading } = useMediaData(selectedChannel, selectedType);
  
  useMediaSubscription(setMedia, toast);

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    const { data, error } = await supabase
      .from('channels')
      .select('title, chat_id');
    
    if (error) {
      console.error('Error fetching channels:', error);
      return;
    }
    
    setChannels(data || []);
  };

  if (isLoading) {
    return <MediaGallerySkeleton />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Media Gallery</h2>
      
      <WebhookInterface />
      
      <MediaFilters
        selectedChannel={selectedChannel}
        setSelectedChannel={setSelectedChannel}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        channels={channels}
      />

      {media.length === 0 ? (
        <p className="text-center text-gray-400 py-8">
          No media files yet. Send some media to your Telegram bot!
        </p>
      ) : (
        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {media.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default MediaGallery;