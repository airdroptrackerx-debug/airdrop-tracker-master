
interface ProgressBarProps {
  progress: number;
}

export const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className="w-full h-1.5 bg-muted rounded-full mb-3">
      <div 
        className="timer-progress" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
