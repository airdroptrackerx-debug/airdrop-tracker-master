
import { useState } from 'react';
import { TasksProvider, useTasks } from '@/context/TasksContext';

import TaskCard from '@/components/TaskCard';
import TaskDialog, { TaskFormData } from '@/components/TaskDialog';

import CompletionStats from '@/components/CompletionStats';
import MotivationalMessage from '@/components/MotivationalMessage';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

import GuidelinesDrawer from '@/components/GuidelinesDrawer';

function TaskGrid() {
  const { tasks, isLoading, addTask, updateTask, deleteTask, completeTask, completionRate } = useTasks();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [editingTask, setEditingTask] = useState<TaskFormData | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const handleOpenAddDialog = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };


  const handleEditTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
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

  const showNoTasksState = tasks.length === 0;

  return (
    <div>
      <CompletionStats tasks={tasks} />
      
      {tasks.length > 0 && <MotivationalMessage completionRate={completionRate} />
      
      {showNoTasksState && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-5xl mb-4">👋</div>
          <h2 className="text-2xl font-semibold mb-2">No tasks yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Add your first crypto airdrop task to start tracking and get reminders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleOpenAddDialog}>Add Your First Task</Button>
            <GuidelinesDrawer>
              <Button variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                View App Guidelines
              </Button>
            </GuidelinesDrawer>
          </div>
        </div>
      )}
      

      
      {tasks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {tasks.map((task) => (
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
      
      {/* Task Edit Dialog */}
      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveTask}
        editingTask={editingTask}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-crypto-bg-card border-muted">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this task and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      

    </div>
  );
}

// Main app with provider
const Index = () => {
  return (
    <TasksProvider>
      <div className="container mx-auto px-4 pb-12">
        <TaskGrid />
      </div>
    </TasksProvider>
  );
};

export default Index;
