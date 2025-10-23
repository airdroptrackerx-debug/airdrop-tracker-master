
import { useState, useEffect } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TaskFormData } from './TaskDialog';

interface CompletionStatsProps {
  tasks: TaskFormData[];
}

export default function CompletionStats({ tasks }: CompletionStatsProps) {
  const [completedTasks, setCompletedTasks] = useState(0);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [upcomingDue, setUpcomingDue] = useState<string | null>(null);

  useEffect(() => {
    if (tasks.length === 0) {
      setCompletedTasks(0);
      setCompletionPercentage(0);
      setUpcomingDue(null);
      return;
    }

    // Count completed tasks (those with lastCompleted date within the last 24h)
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    
    const completedCount = tasks.filter(task => {
      const lastCompleted = task.lastCompleted ? new Date(task.lastCompleted).getTime() : null;
      return lastCompleted && lastCompleted > oneDayAgo;
    }).length;
    
    setCompletedTasks(completedCount);
    setCompletionPercentage(tasks.length ? (completedCount / tasks.length) * 100 : 0);

    // Find next upcoming due task
    let nextDue: { time: number, title: string } | null = null;
    
    tasks.forEach(task => {
      if (!task.lastCompleted) return; // Skip tasks without lastCompleted
      
      const lastCompletedTime = new Date(task.lastCompleted).getTime();
      const timerMs = task.timerType === 'custom' 
        ? task.customHours * 60 * 60 * 1000 
        : parseInt(task.timerType.replace('h', '')) * 60 * 60 * 1000;
      
      const dueTime = lastCompletedTime + timerMs;
      
      // If it's already due or will be due sooner than current next due
      if ((!nextDue && dueTime > now) || (nextDue && dueTime < nextDue.time && dueTime > now)) {
        nextDue = { time: dueTime, title: task.title };
      }
    });
    
    if (nextDue) {
      const minutesUntilDue = Math.max(0, Math.floor((nextDue.time - now) / (60 * 1000)));
      const hoursUntilDue = Math.floor(minutesUntilDue / 60);
      const remainingMinutes = minutesUntilDue % 60;
      
      setUpcomingDue(
        `${nextDue.title} (in ${hoursUntilDue ? `${hoursUntilDue}h ` : ''}${remainingMinutes}m)`
      );
    } else {
      setUpcomingDue(null);
    }
  }, [tasks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pt-8 animate-fade-in">
      <Card className="bg-card border-muted">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-crypto-purple" />
            <span>Today's Completion</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold mb-2">
            {completedTasks} / {tasks.length}
          </div>
          <Progress value={completionPercentage} className="h-2 bg-muted" />
        </CardContent>
      </Card>
      
      <Card className="bg-card border-muted">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-crypto-purple" />
            <span>Next Due</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-medium text-muted-foreground line-clamp-1">
            {upcomingDue || "Nothing due soon"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
