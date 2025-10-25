import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IntensityType, TimerType } from "./TaskCard";
import { useToast } from "@/hooks/use-toast";
import { getFaviconUrl } from "@/utils/urlValidation";

export interface TaskFormData {
  id?: string;
  title: string;
  url: string;
  intensity: IntensityType;
  timerType: TimerType;
  customHours: number;
  thumbnailUrl: string;
  lastCompleted?: Date;
}

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: TaskFormData) => void;
  editingTask: TaskFormData | null;
}

const generateThumbnail = async (url: string): Promise<string> => {
  // Use safe favicon URL generator
  return getFaviconUrl(url);
};

export default function TaskDialog({
  open,
  onOpenChange,
  onSave,
  editingTask,
}: TaskDialogProps) {
  const { toast } = useToast();

  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    url: "https://",
    intensity: "amber",
    timerType: "12h",
    customHours: 4,
    thumbnailUrl: "",
  });

  // Update form when editing task changes
  useEffect(() => {
    if (editingTask) {
      setFormData({
        ...editingTask,
      });
    } else {
      // Reset form for new task
      setFormData({
        title: "",
        url: "https://",
        intensity: "amber",
        timerType: "12h",
        customHours: 4,
        thumbnailUrl: "",
      });
    }
  }, [editingTask, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIntensityChange = (value: IntensityType) => {
    setFormData((prev) => ({
      ...prev,
      intensity: value,
    }));
  };

  const handleTimerTypeChange = (value: TimerType) => {
    setFormData((prev) => ({
      ...prev,
      timerType: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title",
        variant: "destructive",
      });
      return;
    }

    if (!formData.url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    try {
      // Auto-correct URL by prepending https:// if missing
      let correctedUrl = formData.url.trim();
      if (
        !correctedUrl.startsWith("http://") &&
        !correctedUrl.startsWith("https://")
      ) {
        correctedUrl = "https://" + correctedUrl;
      }

      // Validate URL format
      new URL(correctedUrl);

      // Update formData with corrected URL
      formData.url = correctedUrl;

      // Generate thumbnail if not already set or editing
      if (!formData.thumbnailUrl || !editingTask) {
        const thumbnailUrl = await generateThumbnail(formData.url);
        formData.thumbnailUrl = thumbnailUrl;
      }

      onSave(formData);
      onOpenChange(false);

      toast({
        title: editingTask ? "Task updated" : "Task created",
        description: editingTask
          ? "Your task has been updated successfully"
          : "Your task has been created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Please enter a valid URL (e.g., example.com or https://example.com)",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card text-foreground border-muted pb-8 sm:pb-6">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingTask ? "Edit Task" : "Add New Airdrop Task"}
            </DialogTitle>
            <DialogDescription>
              {editingTask
                ? "Update your airdrop task details below"
                : "Fill in the details to track a new crypto airdrop opportunity"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title">Project Name</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter project name"
                className="bg-muted"
              />
            </div>

            {/* URL */}
            <div className="grid gap-2">
              <Label htmlFor="url">Project URL</Label>
              <Input
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="bg-muted"
              />
            </div>

            {/* Intensity */}
            <div className="grid gap-2">
              <Label>Intensity Level</Label>
              <RadioGroup
                value={formData.intensity}
                onValueChange={(value) =>
                  handleIntensityChange(value as IntensityType)
                }
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="red"
                    id="intensity-red"
                    className="border-crypto-red"
                  />
                  <Label htmlFor="intensity-red" className="cursor-pointer">
                    High
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="amber"
                    id="intensity-amber"
                    className="border-crypto-amber"
                  />
                  <Label htmlFor="intensity-amber" className="cursor-pointer">
                    Medium
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="green"
                    id="intensity-green"
                    className="border-crypto-green"
                  />
                  <Label htmlFor="intensity-green" className="cursor-pointer">
                    Low
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Timer Type */}
            <div className="grid gap-2">
              <Label>Reminder Interval</Label>
              <RadioGroup
                value={formData.timerType}
                onValueChange={(value) =>
                  handleTimerTypeChange(value as TimerType)
                }
                className="flex flex-wrap items-center gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="8h" id="timer-8h" />
                  <Label htmlFor="timer-8h" className="cursor-pointer">
                    8 hours
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="12h" id="timer-12h" />
                  <Label htmlFor="timer-12h" className="cursor-pointer">
                    12 hours
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="24h" id="timer-24h" />
                  <Label htmlFor="timer-24h" className="cursor-pointer">
                    24 hours
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="timer-custom" />
                  <Label htmlFor="timer-custom" className="cursor-pointer">
                    Custom
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Custom Hours (conditional) */}
            {formData.timerType === "custom" && (
              <div className="grid gap-2">
                <Label htmlFor="customHours">Custom Hours</Label>
                <Input
                  id="customHours"
                  name="customHours"
                  type="number"
                  min="1"
                  max="72"
                  value={formData.customHours}
                  onChange={handleInputChange}
                  className="bg-muted"
                />
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pb-2 sm:pb-0">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">
              {editingTask ? "Update Task" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
