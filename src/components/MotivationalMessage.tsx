
import { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

interface MotivationalMessageProps {
  completionRate: number;
}

const messages = {
  low: [
    { text: "C'mon, you've got this!", emoji: "😊" },
    { text: "Small steps lead to big results!", emoji: "🚶" },
    { text: "The journey of a thousand miles begins with a single step.", emoji: "🏁" }
  ],
  medium: [
    { text: "Halfway there! Keep it up!", emoji: "🎉" },
    { text: "You're making great progress!", emoji: "💪" },
    { text: "Building momentum! Don't stop now.", emoji: "🚀" }
  ],
  high: [
    { text: "So close! One last push!", emoji: "💪" },
    { text: "Almost there! You're crushing it!", emoji: "🌟" },
    { text: "Excellence in motion! Finish strong!", emoji: "🏆" }
  ]
};

export default function MotivationalMessage({ completionRate }: MotivationalMessageProps) {
  const [message, setMessage] = useState({ text: '', emoji: '' });
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Determine message category based on completion rate
    let category: 'low' | 'medium' | 'high';
    
    if (completionRate < 0.3) {
      category = 'low';
    } else if (completionRate < 0.7) {
      category = 'medium';
    } else {
      category = 'high';
    }
    
    // Select a random message from the category
    const messagesInCategory = messages[category];
    const randomIndex = Math.floor(Math.random() * messagesInCategory.length);
    
    // Trigger animation by resetting and then setting the animate state
    setAnimate(false);
    setTimeout(() => {
      setMessage(messagesInCategory[randomIndex]);
      setAnimate(true);
    }, 100);
    
  }, [completionRate]);

  if (!message.text) return null;

  return (
    <div className={cn(
      "flex items-center justify-center p-2 mb-6 transition-opacity",
      animate ? "opacity-100" : "opacity-0"
    )}>
      <Badge
        variant="outline" 
        className="bg-crypto-purple/10 text-foreground border-crypto-purple/30 px-4 py-2 text-sm animate-pulse-glow"
      >
        <span className="mr-2">{message.emoji}</span>
        {message.text}
      </Badge>
    </div>
  );
}
