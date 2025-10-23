
import { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

interface MotivationalMessageProps {
  completionRate: number;
}

const messages = {
  zero: [
    { text: "Sigh 😒, here we go again!", emoji: "😤" },
    { text: "Fresh start! Let's make today count!", emoji: "🌅" },
    { text: "Time to grind! You've got this!", emoji: "💼" }
  ],
  veryLow: [
    { text: "Don't give up, you can do this!", emoji: "💪" },
    { text: "Every journey starts with a single step!", emoji: "👣" },
    { text: "Just getting started! Keep going!", emoji: "🚀" }
  ],
  low: [
    { text: "Nice start! Building momentum now!", emoji: "⚡" },
    { text: "You're on fire! Keep it burning!", emoji: "🔥" },
    { text: "Small wins add up! Stay consistent!", emoji: "📈" }
  ],
  medium: [
    { text: "🎉 Halfway there! Keep it up!", emoji: "🎊" },
    { text: "You're crushing it! Don't stop now!", emoji: "💪" },
    { text: "50% done! The finish line is in sight!", emoji: "🏃" }
  ],
  high: [
    { text: "Looking good! Almost there!", emoji: "😎" },
    { text: "You're in the zone! Keep pushing!", emoji: "🔥" },
    { text: "So close! Don't lose focus now!", emoji: "🎯" }
  ],
  veryHigh: [
    { text: "You're almost done for the day!", emoji: "🌟" },
    { text: "Final sprint! Finish strong!", emoji: "🏆" },
    { text: "Excellence in motion! One more push!", emoji: "⚡" }
  ],
  complete: [
    { text: "You're a real champ my gee, time to finally chill a bit! 😎", emoji: "🏆" },
    { text: "Keep up the consistency, it'll pay later on 🤑", emoji: "💰" },
    { text: "All done! You absolutely crushed it today! 🎉", emoji: "🔥" },
    { text: "Beast mode complete! Time to relax! 🛋️", emoji: "👑" }
  ]
};

export default function MotivationalMessage({ completionRate }: MotivationalMessageProps) {
  const [message, setMessage] = useState({ text: '', emoji: '' });
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Determine message category based on completion rate
    let category: 'zero' | 'veryLow' | 'low' | 'medium' | 'high' | 'veryHigh' | 'complete';
    
    if (completionRate === 0) {
      category = 'zero'; // 0% - Not started
    } else if (completionRate >= 1) {
      category = 'complete'; // 100% - All done!
    } else if (completionRate < 0.2) {
      category = 'veryLow'; // 1-19% - Just starting
    } else if (completionRate < 0.4) {
      category = 'low'; // 20-39% - Early progress
    } else if (completionRate < 0.6) {
      category = 'medium'; // 40-59% - Halfway there!
    } else if (completionRate < 0.8) {
      category = 'high'; // 60-79% - Good progress
    } else {
      category = 'veryHigh'; // 80-99% - Almost done!
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
