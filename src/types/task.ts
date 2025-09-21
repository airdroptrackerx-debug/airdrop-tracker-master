
export type TimerType = '8h' | '12h' | '24h' | 'custom';
export type IntensityType = 'red' | 'amber' | 'green';

export interface TaskCardProps {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  intensity: IntensityType;
  timerType: TimerType;
  customHours?: number;
  lastCompleted?: Date;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string, completed: boolean) => void;
}
