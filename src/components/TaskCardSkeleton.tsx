import { Card } from "@/components/ui/card";

export function TaskCardSkeleton() {
  return (
    <Card className="relative rounded-xl p-4 bg-card shadow-md animate-pulse">
      {/* Progress bar skeleton */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted rounded-b-xl" />

      <div className="flex flex-col items-center">
        {/* Thumbnail skeleton */}
        <div className="w-full aspect-video mb-3 bg-muted rounded-lg" />

        {/* Title skeleton */}
        <div className="h-6 w-3/4 bg-muted rounded mb-1" />

        {/* Time remaining skeleton */}
        <div className="h-4 w-1/2 bg-muted rounded mb-3" />

        {/* Actions skeleton */}
        <div className="flex gap-2 w-full">
          <div className="h-9 flex-1 bg-muted rounded" />
          <div className="h-9 w-9 bg-muted rounded" />
          <div className="h-9 w-9 bg-muted rounded" />
        </div>
      </div>
    </Card>
  );
}
