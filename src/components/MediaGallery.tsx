import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "./ui/scroll-area";

interface MediaItem {
  id: string;
  file_url: string;
  caption: string;
  media_type: string;
  created_at: string;
}

const MediaGallery = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);

  useEffect(() => {
    fetchMedia();
    const subscription = supabase
      .channel('media_changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'media' 
      }, payload => {
        const newMedia = payload.new as MediaItem;
        setMedia(prev => [...prev, newMedia]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchMedia = async () => {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching media:', error);
      return;
    }
    
    setMedia(data || []);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">Media Gallery</h2>
      <ScrollArea className="h-[400px]">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {media.map((item) => (
            <div key={item.id} className="relative group">
              <img
                src={item.file_url}
                alt={item.caption || 'Media'}
                className="w-full h-48 object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
              />
              {item.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
                  <p className="text-sm truncate">{item.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MediaGallery;