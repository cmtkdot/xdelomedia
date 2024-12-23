import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { MediaItem, Channel } from "./types";
import MediaCard from "./MediaCard";
import MediaFilters from "./MediaFilters";
import { useNavigate } from "react-router-dom";

const MediaGallery = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [channels, setChannels] = useState<Channel[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchChannels();
    fetchMedia();
    setupRealtimeSubscription();
  }, []);

  const setupRealtimeSubscription = () => {
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
        setMedia(prev => [newMedia, ...prev]);
        
        // Forward to webhook
        try {
          const response = await supabase.functions.invoke('webhook-forwarder', {
            body: { record_type: 'media', record_id: newMedia.id }
          });
          
          if (!response.error) {
            console.log('Successfully forwarded to webhook');
          } else {
            console.error('Webhook forwarding failed:', response.error);
          }
        } catch (error) {
          console.error('Error forwarding to webhook:', error);
        }

        toast({
          title: "New Media Received",
          description: newMedia.caption || "New media file has been added",
        });
      })
      .subscribe();

    return () => {
      console.log("Cleaning up subscription");
      subscription.unsubscribe();
    };
  };

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

  useEffect(() => {
    fetchMedia();
  }, [selectedChannel, selectedType]);

  if (isLoading) {
    return (
      <div className="bg-transparent rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">Media Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="w-full h-48 rounded-lg bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-white">Media Gallery</h2>
      
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