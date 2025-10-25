import { useState, useEffect } from "react";
import { useTasks } from "@/context/TasksContext";
import { checkAndStoreLevelUp } from "@/utils/levelUpDetection";
import { useNavigate } from "react-router-dom";

import TaskCard from "@/components/TaskCard";
import TaskDialog, { TaskFormData } from "@/components/TaskDialog";
import { TaskSearch } from "@/components/TaskSearch";
import { TaskCardSkeleton } from "@/components/TaskCardSkeleton";
import { EnhancedEmptyState } from "@/components/EnhancedEmptyState";

import CompletionStats from "@/components/CompletionStats";
import MotivationalMessage from "@/components/MotivationalMessage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Moon, Sun, Plus, Rocket, Sparkles, ArrowRight } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useTheme } from "@/components/ThemeProvider";
import { WelcomeBanner } from "@/components/WelcomeBanner";

function TaskGrid() {
  const {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    completionRate,
  } = useTasks();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [editingTask, setEditingTask] = useState<TaskFormData | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Check for level-ups whenever task count changes
  useEffect(() => {
    if (!isLoading && tasks.length > 0) {
      const result = checkAndStoreLevelUp(tasks.length);
      if (result.leveledUp) {
        console.log(
          `🎉 Level up detected: ${result.previousLevel} → ${result.newLevel}`
        );
      }
    }
  }, [tasks.length, isLoading]);

  const handleOpenAddDialog = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleEditTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setEditingTask(task);
      setDialogOpen(true);
    }
  };

  const handleDeleteTask = (id: string) => {
    setTaskToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleSaveTask = (taskData: TaskFormData) => {
    if (editingTask && editingTask.id) {
      // If editing an existing task
      updateTask({ ...taskData, id: editingTask.id });
    } else {
      // If creating a new task
      addTask(taskData);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center mt-12">Loading tasks...</div>;
  }

  // Filter tasks based on search query
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showNoTasksState = !isLoading && tasks.length === 0;

  return (
    <div>
      <CompletionStats tasks={tasks} />

      {tasks.length > 0 && (
        <MotivationalMessage completionRate={completionRate} />
      )}

      {/* Search Bar - shows only when user has tasks */}
      {tasks.length > 0 && <TaskSearch onSearch={setSearchQuery} />}

      {showNoTasksState && (
        <EnhancedEmptyState onAddTask={handleOpenAddDialog} />
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mt-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <TaskCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && tasks.length > 0 && (
        <>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No tasks match your search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mt-6">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id!}
                  title={task.title}
                  url={task.url}
                  thumbnailUrl={task.thumbnailUrl}
                  intensity={task.intensity}
                  timerType={task.timerType}
                  customHours={task.customHours}
                  lastCompleted={task.lastCompleted}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onComplete={completeTask}
                />
              ))}
            </div>
          )}

          {/* Explorer Discovery Card */}
          <Card
            className="mt-8 overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border-primary/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
            onClick={() => navigate("/explorer")}
          >
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-4 text-center sm:text-left">
                  <div className="flex-shrink-0 bg-primary/20 p-3 rounded-full">
                    <Rocket className="h-8 w-8 text-primary group-hover:animate-bounce" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                      <h3 className="text-xl font-bold">
                        Discover New Airdrops
                      </h3>
                      <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                    </div>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      Explore verified airdrop campaigns curated by our team.
                      Find your next opportunity!
                    </p>
                  </div>
                </div>
                <Button
                  variant="default"
                  className="flex-shrink-0 group-hover:scale-105 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/explorer");
                  }}
                >
                  Explore Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Task Edit Dialog */}
      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveTask}
        editingTask={editingTask}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-muted">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this task and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Main app component
const Index = () => {
  const { theme, setTheme } = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskFormData | null>(null);
  const { addTask, updateTask } = useTasks();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleOpenAddDialog = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleSaveTask = (task: TaskFormData) => {
    if (editingTask) {
      updateTask(task);
    } else {
      addTask(task);
    }
  };

  return (
    <main id="main-content">
      <WelcomeBanner />
      <div className="container mx-auto px-4 pb-12">
        <TaskGrid />

        {/* Task Dialog for mobile floating button */}
        <TaskDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleSaveTask}
          editingTask={editingTask}
        />

        {/* Floating Add Task Button */}
        <Button
          variant="default"
          size="icon"
          onClick={handleOpenAddDialog}
          aria-label="Add new task"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary/90 hover:bg-primary backdrop-blur-sm border border-primary/20 z-40 md:h-12 md:w-12"
        >
          <Plus className="h-6 w-6 md:h-5 md:w-5" />
        </Button>
      </div>
    </main>
  );
};

export default Index;
