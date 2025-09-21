
import { cn } from '@/lib/utils';
import { Check, Edit, Trash2, MoreVertical } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface TaskActionsProps {
  id: string;
  completed: boolean;
  onComplete: (id: string, completed: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskActions = ({ 
  id, 
  completed, 
  onComplete, 
  onEdit, 
  onDelete 
}: TaskActionsProps) => {
  
  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    onComplete(id, !completed);
  };

  return (
    <div className="flex items-center justify-between w-full">
      <button
        onClick={handleComplete}
        className={cn(
          "rounded-full w-8 h-8 flex items-center justify-center transition-colors",
          completed ? "bg-crypto-green/20 hover:bg-crypto-green/30" : "bg-muted hover:bg-muted/80"
        )}
      >
        <Check className={cn(
          "w-5 h-5",
          completed ? "text-crypto-green" : "text-muted-foreground"
        )} />
      </button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="rounded-full w-8 h-8 flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors"
            onClick={(e) => e.stopPropagation()} // Prevent card click
          >
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            onEdit(id);
          }}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            onDelete(id);
          }}>
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
