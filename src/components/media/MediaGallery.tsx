import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { MediaItem, Channel } from "./types";
import MediaCard from "./MediaCard";
import MediaFilters from "./MediaFilters";
import WebhookInterface from "../webhook/WebhookInterface";
import MediaGallerySkeleton from "./MediaGallerySkeleton";
import useMediaSubscription from "./hooks/useMediaSubscription";
import useMediaData from "./hooks/useMediaData";
import { Image } from "lucide-react";

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
      <div className="flex items-center gap-2 mb-4">
        <Image className="w-6 h-6 text-[#0088cc]" />
        <h2 className="text-xl font-semibold text-white">Media Gallery</h2>
      </div>
      
      <WebhookInterface />
      
      <MediaFilters
        selectedChannel={selectedChannel}
        setSelectedChannel={setSelectedChannel}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        channels={channels}
      />

      {media.length === 0 ? (
        <div className="text-center py-8 bg-white/5 rounded-lg border border-white/10 backdrop-blur-xl">
          <p className="text-gray-400">
            No media files yet. Send some media to your Telegram bot!
          </p>
        </div>
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