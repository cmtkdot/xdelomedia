import { MediaItem } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface MediaCardProps {
  item: MediaItem;
}

const MediaCard = ({ item }: MediaCardProps) => {
  const isVideo = item.media_type === "video";
  const metadata = item.metadata as { telegram_file_id: string; width: number; height: number; file_size: number; };

  return (
    <Card className="overflow-hidden bg-black/20 border-white/10 hover:border-white/20 transition-colors">
      <CardContent className="p-0">
        <div className="aspect-video relative">
          {isVideo ? (
            <video
              src={item.file_url}
              className="w-full h-full object-cover"
              controls
              preload="metadata"
            />
          ) : (
            <img
              src={item.file_url}
              alt={item.caption || "Media"}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        <div className="p-4 space-y-2">
          {item.caption && (
            <p className="text-sm text-white/80 line-clamp-2">{item.caption}</p>
          )}
          
          <div className="flex justify-between items-center text-xs text-white/60">
            <span>{item.chat?.title || "Unknown Channel"}</span>
            <span>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaCard;