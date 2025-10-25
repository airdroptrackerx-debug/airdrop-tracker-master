import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface TaskThumbnailProps {
  thumbnailUrl: string;
  title: string;
  completed: boolean;
}

export const TaskThumbnail = ({
  thumbnailUrl,
  title,
  completed,
}: TaskThumbnailProps) => {
  // Simple solid color placeholder as data URI - always works, no external dependency
  const fallbackImage =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect width="150" height="150" fill="%23374151"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="%239ca3af"%3ENo Preview%3C/text%3E%3C/svg%3E';

  return (
    <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden bg-black/20">
      <img
        src={thumbnailUrl || fallbackImage}
        alt={title}
        className={cn(
          "w-full h-full object-cover transition-opacity",
          completed ? "opacity-60" : "opacity-100"
        )}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          // Prevent infinite loop - only set fallback once
          if (target.src !== fallbackImage) {
            target.src = fallbackImage;
          }
        }}
      />

      {/* Completed overlay */}
      {completed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Check className="w-10 h-10 text-crypto-green" />
        </div>
      )}
    </div>
  );
};
