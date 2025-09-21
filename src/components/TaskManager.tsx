
import { useState } from 'react';
import { useTasks } from '@/context/TasksContext';
import TaskDialog, { TaskFormData } from '@/components/TaskDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function TaskManager() {
  const { addTask } = useTasks();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleOpenAddDialog = () => {
    setDialogOpen(true);
  };
  
  const handleSaveTask = (taskData: TaskFormData) => {
    addTask(taskData);
  };
  
  return (
    <>
      <div className="flex justify-end mb-6 animate-slide-in">
        <Button onClick={handleOpenAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Task
        </Button>
      </div>
      
      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveTask}
        editingTask={null}
      />
    </>
  );
}
