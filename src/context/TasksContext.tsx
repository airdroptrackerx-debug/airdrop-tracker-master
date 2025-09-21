 
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TaskFormData } from '@/components/TaskDialog';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';


interface TasksContextType {
  tasks: TaskFormData[];
  isLoading: boolean;
  addTask: (task: TaskFormData) => void;
  updateTask: (task: TaskFormData) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string, completed: boolean) => void;
  completionRate: number;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<TaskFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completionRate, setCompletionRate] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const loadTasks = () => {
      setIsLoading(true);
      try {
        const savedTasks = localStorage.getItem('airdropTasks');
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your tasks',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Save tasks to localStorage as fallback when not logged in
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('airdropTasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  // Calculate completion rate whenever tasks change
  useEffect(() => {
    if (tasks.length === 0) {
      setCompletionRate(0);
      return;
    }

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    
    const completedCount = tasks.filter(task => {
      const lastCompleted = task.lastCompleted ? new Date(task.lastCompleted).getTime() : null;
      return lastCompleted && lastCompleted > oneDayAgo;
    }).length;
    
    setCompletionRate(completedCount / tasks.length);
  }, [tasks]);

  // Check for expired timers periodically and reset them
  useEffect(() => {
    const checkExpiredTimers = () => {
      const now = Date.now();
      
      const updatedTasks = tasks.map(task => {
        if (!task.lastCompleted) return task;
        
        const lastCompletedTime = new Date(task.lastCompleted).getTime();
        let timerDuration = 24 * 60 * 60 * 1000; // Default 24 hours
        
        // Calculate timer duration based on timerType
        if (task.timerType === 'custom' && task.customHours) {
          timerDuration = task.customHours * 60 * 60 * 1000;
        } else if (task.timerType) {
          const hours = parseInt(task.timerType.replace('h', ''));
          timerDuration = hours * 60 * 60 * 1000;
        }
        
        // If timer has expired, reset lastCompleted
        if (now >= lastCompletedTime + timerDuration) {
          return { ...task, lastCompleted: undefined };
        }
        
        return task;
      });
      
      // Only update if we have changes
      if (JSON.stringify(updatedTasks) !== JSON.stringify(tasks)) {
        setTasks(updatedTasks);
      }
    };
    
    const intervalId = setInterval(checkExpiredTimers, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [tasks]);

  const addTask = (task: TaskFormData) => {
    const newTask = {
      ...task,
      id: uuidv4(),
    };

    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (updatedTask: TaskFormData) => {
    if (!updatedTask.id) return;
    
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completeTask = async (id: string, completed: boolean) => {
    try {
      const lastCompletedValue = completed ? new Date() : undefined;
      
      if (user) {
        // With our stubbed Supabase client, just call update and forget
        await supabase.from('tasks').update();
      }
      
      // Update local state
      const updatedTasks = tasks.map(task => {
        if (task.id === id) {
          return {
            ...task,
            lastCompleted: lastCompletedValue
          };
        }
        return task;
      });
      
      setTasks(updatedTasks);
      
      // Explicitly save to localStorage
      localStorage.setItem('airdropTasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task status',
        variant: 'destructive',
      });
    }
  };

  return (
    <TasksContext.Provider value={{
      tasks,
      isLoading,
      addTask,
      updateTask,
      deleteTask,
      completeTask,
      completionRate
    }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  
  return context;
}
