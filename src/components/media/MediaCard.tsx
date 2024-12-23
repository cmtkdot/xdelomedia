import { MediaItem } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface MediaCardProps {
  item: MediaItem;
}

const MediaCard = ({ item }: MediaCardProps) => {
  const isVideo = item.media_type === "video";

  return (
    <Card className="overflow-hidden bg-black/20 border-white/10 hover:border-white/20 transition-colors h-full">
      <CardContent className="p-0 flex flex-col h-full">
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
              loading="lazy"
            />
          )}
        </div>
        
        <div className="p-3 md:p-4 space-y-2 flex-1 flex flex-col">
          {item.caption && (
            <p className="text-sm text-white/80 line-clamp-2 flex-1">
              {item.caption}
            </p>
          )}
          
          <div className="flex justify-between items-center text-xs text-white/60 mt-auto">
            <span className="truncate max-w-[120px] md:max-w-[150px]">
              {item.chat?.title || "Unknown Channel"}
            </span>
            <span className="shrink-0">
              {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaCard;