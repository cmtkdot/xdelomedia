import { Skeleton } from "@/components/ui/skeleton";

const MediaGallerySkeleton = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Media Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="w-full h-48 rounded-lg bg-white/5" />
        ))}
      </div>
    </div>
  );
};

export default MediaGallerySkeleton;