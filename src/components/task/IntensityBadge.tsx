
import { cn } from '@/lib/utils';
import { IntensityType } from '@/types/task';

interface IntensityBadgeProps {
  intensity: IntensityType;
  completed: boolean;
}

export const IntensityBadge = ({ intensity, completed }: IntensityBadgeProps) => {
  const getIntensityClass = () => {
    if (completed) return 'intensity-green';
    
    switch (intensity) {
      case 'red': return 'intensity-red';
      case 'amber': return 'intensity-amber';
      case 'green': return 'intensity-green';
      default: return '';
    }
  };

  return <div className={cn("intensity-badge", getIntensityClass())} />;
};
