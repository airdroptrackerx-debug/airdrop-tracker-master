import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { TaskFormData } from "@/components/TaskDialog";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";
import { getErrorMessage } from "@/utils/errorMessages";
import { validateTaskUrl, getFaviconUrl } from "@/utils/urlValidation";

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
  const { user } = useAuth();

  // Load tasks from Firestore in real-time
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Create a query for tasks belonging to this user
    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("userId", "==", user.uid));

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedTasks: TaskFormData[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();

          // Validate and sanitize URL - prevents app crashes from bad data
          const safeUrl = validateTaskUrl(data.url);
          const safeThumbnail = data.thumbnailUrl || getFaviconUrl(safeUrl);

          loadedTasks.push({
            id: doc.id,
            title: data.title || "Untitled Task",
            url: safeUrl,
            thumbnailUrl: safeThumbnail,
            intensity: data.intensity || "medium",
            timerType: data.timerType || "daily",
            customHours: data.customHours || 0,
            lastCompleted: data.lastCompleted?.toDate(),
          });
        });
        setTasks(loadedTasks);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error loading tasks:", error);
        toast({
          title: "Error",
          description: "Failed to load your tasks",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, toast]);

  // Calculate completion rate whenever tasks change
  useEffect(() => {
    if (tasks.length === 0) {
      setCompletionRate(0);
      return;
    }

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    const completedCount = tasks.filter((task) => {
      const lastCompleted = task.lastCompleted
        ? new Date(task.lastCompleted).getTime()
        : null;
      return lastCompleted && lastCompleted > oneDayAgo;
    }).length;

    setCompletionRate(completedCount / tasks.length);
  }, [tasks]);

  // Check for expired timers periodically and reset them
  useEffect(() => {
    const checkExpiredTimers = () => {
      const now = Date.now();

      const updatedTasks = tasks.map((task) => {
        if (!task.lastCompleted) return task;

        const lastCompletedTime = new Date(task.lastCompleted).getTime();
        let timerDuration = 24 * 60 * 60 * 1000; // Default 24 hours

        // Calculate timer duration based on timerType
        if (task.timerType === "custom" && task.customHours) {
          timerDuration = task.customHours * 60 * 60 * 1000;
        } else if (task.timerType) {
          const hours = parseInt(task.timerType.replace("h", ""));
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

  const addTask = async (task: TaskFormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add tasks",
        variant: "destructive",
      });
      return;
    }

    try {
      // Validate URL before saving
      const safeUrl = validateTaskUrl(task.url);
      const safeThumbnail = task.thumbnailUrl || getFaviconUrl(safeUrl);

      const tasksRef = collection(db, "tasks");
      await addDoc(tasksRef, {
        ...task,
        url: safeUrl,
        thumbnailUrl: safeThumbnail,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast({
        title: "Success",
        description: "Task added successfully!",
      });
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const updateTask = async (updatedTask: TaskFormData) => {
    if (!updatedTask.id || !user) return;

    try {
      // Validate URL before updating
      const safeUrl = validateTaskUrl(updatedTask.url);
      const safeThumbnail = updatedTask.thumbnailUrl || getFaviconUrl(safeUrl);

      const taskRef = doc(db, "tasks", updatedTask.id);
      await updateDoc(taskRef, {
        title: updatedTask.title,
        url: safeUrl,
        thumbnailUrl: safeThumbnail,
        intensity: updatedTask.intensity,
        timerType: updatedTask.timerType,
        customHours: updatedTask.customHours,
        updatedAt: serverTimestamp(),
      });

      toast({
        title: "Success",
        description: "Task updated successfully!",
      });
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return;

    try {
      const taskRef = doc(db, "tasks", id);
      await deleteDoc(taskRef);

      toast({
        title: "Success",
        description: "Task deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const completeTask = async (id: string, completed: boolean) => {
    if (!user) return;

    try {
      const taskRef = doc(db, "tasks", id);
      const lastCompletedValue = completed ? serverTimestamp() : null;

      await updateDoc(taskRef, {
        lastCompleted: lastCompletedValue,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error completing task:", error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        isLoading,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        completionRate,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);

  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider");
  }

  return context;
}
