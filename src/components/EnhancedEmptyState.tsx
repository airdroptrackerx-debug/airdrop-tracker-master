import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Plus, Youtube, BookOpen, Sparkles } from "lucide-react";

interface EnhancedEmptyStateProps {
  onAddTask: () => void;
}

export function EnhancedEmptyState({ onAddTask }: EnhancedEmptyStateProps) {
  return (
    <Card className="p-8 text-center max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 animate-pulse-glow">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-2">
          Welcome to Your Task Manager!
        </h3>
        <p className="text-muted-foreground mb-6">
          Start tracking crypto airdrops and never miss a deadline again.
        </p>
      </div>

      {/* Quick Start Steps */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
          <div className="text-3xl mb-2">1️⃣</div>
          <h4 className="font-semibold mb-1">Add a Task</h4>
          <p className="text-sm text-muted-foreground">
            Click the + button to create your first task
          </p>
        </div>
        <div className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
          <div className="text-3xl mb-2">2️⃣</div>
          <h4 className="font-semibold mb-1">Set a Timer</h4>
          <p className="text-sm text-muted-foreground">
            Choose daily, weekly, or custom intervals
          </p>
        </div>
        <div className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
          <div className="text-3xl mb-2">3️⃣</div>
          <h4 className="font-semibold mb-1">Track Progress</h4>
          <p className="text-sm text-muted-foreground">
            Watch your completion rate grow!
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        <Button
          onClick={onAddTask}
          size="lg"
          className="gap-2 w-full sm:w-auto"
        >
          <Plus className="h-5 w-5" />
          Add Your First Task
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="gap-2 w-full sm:w-auto"
          onClick={() => window.open("/about", "_self")}
        >
          <BookOpen className="h-5 w-5" />
          Learn More
        </Button>
      </div>

      {/* Example Preview */}
      <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-primary/10">
        <p className="text-sm text-muted-foreground">
          💡 <strong className="text-foreground">Example Task:</strong> "Check
          Arbitrum Airdrop Eligibility" - Daily timer, High priority
        </p>
      </div>

      {/* Quick Tips */}
      <div className="mt-4 text-xs text-muted-foreground">
        <p>✨ Tip: You can also discover community airdrops in the Explorer!</p>
      </div>
    </Card>
  );
}
