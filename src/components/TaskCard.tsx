
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { TaskCardProps } from '@/types/task';
import { IntensityBadge } from './task/IntensityBadge';
import { ProgressBar } from './task/ProgressBar';
import { TaskThumbnail } from './task/TaskThumbnail';
import { TaskActions } from './task/TaskActions';
import { calculateTotalMilliseconds, formatTimeRemaining } from '@/utils/timerUtils';

export type { TimerType, IntensityType } from '@/types/task';
export type { TaskCardProps } from '@/types/task';

export default function TaskCard({
  id,
  title,
  url,
  thumbnailUrl,
  intensity,
  timerType,
  customHours = 0,
  lastCompleted,
  onEdit,
  onDelete,
  onComplete
}: TaskCardProps) {
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState('');

  // Handle card click to open URL
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent opening URL when clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    // Set initial completed state based on lastCompleted time
    if (lastCompleted) {
      const totalMs = calculateTotalMilliseconds(timerType, customHours);
      const completedTime = new Date(lastCompleted).getTime();
      const expiryTime = completedTime + totalMs;
      const now = Date.now();
      
      // If timer is still running, mark as completed
      setCompleted(now < expiryTime);
    } else {
      setCompleted(false);
    }
  }, [lastCompleted, timerType, customHours]);

  useEffect(() => {
    const totalMs = calculateTotalMilliseconds(timerType, customHours);
    let startTime = lastCompleted ? new Date(lastCompleted).getTime() : Date.now();
    const endTime = startTime + totalMs;
    
    const updateProgress = () => {
      const now = Date.now();
      
      // If timer has expired, reset completion state
      if (now >= endTime && completed) {
        setCompleted(false);
        onComplete(id, false);
        // Reset startTime to now for the next cycle
        startTime = now;
        return;
      }
      
      // Calculate progress percentage
      const elapsed = now - startTime;
      const newProgress = Math.min(Math.max(0, (elapsed / totalMs) * 100), 100);
      setProgress(completed ? 100 : newProgress);
      
      // Update time remaining display
      if (!completed) {
        const msRemaining = endTime - now;
        setTimeRemaining(formatTimeRemaining(msRemaining));
      } else {
        setTimeRemaining('Completed');
      }
    };
    
    updateProgress(); // Initial update
    const intervalId = setInterval(updateProgress, 30000); // Update every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [id, timerType, customHours, lastCompleted, completed, onComplete]);

  const handleComplete = () => {
    const newCompletedState = !completed;
    setCompleted(newCompletedState);
    onComplete(id, newCompletedState);
  };

  return (
    <div 
      className={cn(
        "relative rounded-xl p-4 bg-card shadow-md animate-fade-in card-hover cursor-pointer",
        completed && "border border-crypto-green/40"
      )}
      onClick={handleCardClick}
    >
      {/* Intensity badge */}
      <IntensityBadge intensity={intensity} completed={completed} />
      
      {/* Progress bar */}
      <ProgressBar progress={progress} />
      
      {/* Card content */}
      <div className="flex flex-col items-center">
        {/* Thumbnail with completion status */}
        <TaskThumbnail 
          thumbnailUrl={thumbnailUrl} 
          title={title}
          completed={completed} 
        />
        
        {/* Title */}
        <h3 className="text-lg font-medium text-center mb-1 line-clamp-1">{title}</h3>
        
        {/* Time remaining */}
        <div className={cn(
          "text-sm mb-3",
          completed ? "text-crypto-green" : "text-muted-foreground"
        )}>
          {timeRemaining}
        </div>
        
        {/* Actions */}
        <TaskActions 
          id={id}
          completed={completed} 
          onComplete={onComplete} 
          onEdit={onEdit} 
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
