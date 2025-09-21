
import { TimerType } from '@/types/task';

export const calculateTotalMilliseconds = (timerType: TimerType, customHours = 0): number => {
  if (timerType === 'custom') {
    return customHours * 60 * 60 * 1000;
  }
  
  const hours = parseInt(timerType.replace('h', ''));
  return hours * 60 * 60 * 1000;
};

export const formatTimeRemaining = (msRemaining: number): string => {
  if (msRemaining <= 0) {
    return 'Due now';
  }
  
  const hoursRemaining = Math.floor(msRemaining / (60 * 60 * 1000));
  const minutesRemaining = Math.floor((msRemaining % (60 * 60 * 1000)) / (60 * 1000));
  return `${hoursRemaining}h ${minutesRemaining}m`;
};
