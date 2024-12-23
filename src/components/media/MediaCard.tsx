import { formatFileSize, formatDate } from "@/lib/utils";
import { MediaItem } from "./types";

interface MediaCardProps {
  item: MediaItem;
}

const MediaCard = ({ item }: MediaCardProps) => {
  const renderMediaContent = (item: MediaItem) => {
    if (item.media_type.includes('video') || item.media_type.includes('animation')) {
      return (
        <video
          src={item.file_url}
          controls
          className="w-full h-48 object-cover"
        >
          Your browser does not support the video tag.
        </video>
      );
    }
    return (
      <img
        src={item.file_url}
        alt={item.caption || 'Media'}
        className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105"
      />
    );
  };

  return (
    <div className="relative group backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
      {renderMediaContent(item)}
      <div className="p-3 backdrop-blur-lg bg-black/40">
        {item.caption && (
          <p className="font-medium text-white mb-2">{item.caption}</p>
        )}
        <div className="text-sm text-gray-300 space-y-1">
          <p>Type: {item.media_type}</p>
          {item.chat && (
            <p>Channel: {item.chat.title}</p>
          )}
          {item.metadata && (
            <>
              <p>Size: {formatFileSize(item.metadata.file_size)}</p>
              <p>Dimensions: {item.metadata.width}x{item.metadata.height}</p>
            </>
          )}
          <p>Added: {formatDate(item.created_at)}</p>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;