
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface TaskThumbnailProps {
  thumbnailUrl: string;
  title: string;
  completed: boolean;
}

export const TaskThumbnail = ({ thumbnailUrl, title, completed }: TaskThumbnailProps) => {
  return (
    <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden bg-black/20">
      <img 
        src={thumbnailUrl || 'https://via.placeholder.com/150'}
        alt={title}
        className={cn(
          "w-full h-full object-cover transition-opacity", 
          completed ? "opacity-60" : "opacity-100"
        )}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'https://via.placeholder.com/150?text=No+Preview';
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
