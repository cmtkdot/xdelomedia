import { useState } from "react";
import useMediaData from "./media/hooks/useMediaData";
import useMediaSubscription from "./media/hooks/useMediaSubscription";
import MediaCard from "./media/MediaCard";
import MediaFilters from "./media/MediaFilters";
import MediaGallerySkeleton from "./media/MediaGallerySkeleton";
import { MediaFilter } from "./media/types";
import { Image } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import WebhookInterface from "./webhook/WebhookInterface";
import { supabase } from "@/integrations/supabase/client";
import { Channel } from "./media/types";

const MediaGallery = () => {
  const [filter, setFilter] = useState<MediaFilter>({
    selectedChannel: "all",
    selectedType: "all",
  });
  const [channels, setChannels] = useState<Channel[]>([]);
  const { toast } = useToast();

  const { data: mediaItems, isLoading } = useMediaData(filter);
  useMediaSubscription();

  // Fetch channels when component mounts
  useState(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    const { data, error } = await supabase
      .from('channels')
      .select('title, chat_id');
    
    if (error) {
      console.error('Error fetching channels:', error);
      toast({
        title: "Error",
        description: "Failed to load channels",
        variant: "destructive",
      });
      return;
    }
    
    setChannels(data || []);
  };

  if (isLoading) {
    return <MediaGallerySkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Image className="w-6 h-6 text-[#0088cc]" />
        <h2 className="text-xl font-semibold text-white">Media Gallery</h2>
      </div>
      
      <WebhookInterface />
      
      <MediaFilters
        selectedChannel={filter.selectedChannel}
        setSelectedChannel={(value) => setFilter(prev => ({ ...prev, selectedChannel: value }))}
        selectedType={filter.selectedType}
        setSelectedType={(value) => setFilter(prev => ({ ...prev, selectedType: value }))}
        channels={channels}
      />

      {!mediaItems || mediaItems.length === 0 ? (
        <div className="text-center py-8 bg-white/5 rounded-lg border border-white/10 backdrop-blur-xl">
          <p className="text-gray-400">
            No media files yet. Send some media to your Telegram bot!
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediaItems.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default MediaGallery;