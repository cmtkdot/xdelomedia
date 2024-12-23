import { useState } from "react";
import useMediaData from "./media/hooks/useMediaData";
import useMediaSubscription from "./media/hooks/useMediaSubscription";
import MediaCard from "./media/MediaCard";
import MediaFilters from "./media/MediaFilters";
import MediaGallerySkeleton from "./media/MediaGallerySkeleton";
import { MediaFilter } from "./media/types";

const MediaGallery = () => {
  const [filter, setFilter] = useState<MediaFilter>({
    selectedChannel: "all",
    selectedType: "all",
  });

  const { data: mediaItems, isLoading } = useMediaData(filter);
  useMediaSubscription();

  if (isLoading) {
    return <MediaGallerySkeleton />;
  }

  return (
    <div className="space-y-6">
      <MediaFilters
        selectedChannel={filter.selectedChannel}
        setSelectedChannel={(value) => setFilter(prev => ({ ...prev, selectedChannel: value }))}
        selectedType={filter.selectedType}
        setSelectedType={(value) => setFilter(prev => ({ ...prev, selectedType: value }))}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mediaItems?.map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default MediaGallery;