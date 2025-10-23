import { useState, useEffect } from 'react';
import { getActiveUsersCount } from '@/hooks/useActivityTracking';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Users, X, Eye } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export function LiveCommunityIndicator({ variant = 'navbar' }: { variant?: 'navbar' | 'footer' | 'profile' }) {
  const { user } = useAuth();
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isHidden, setIsHidden] = useState(() => {
    // Only check localStorage for navbar variant
    if (variant === 'navbar') {
      return localStorage.getItem('hideLiveIndicator') === 'true';
    }
    return false;
  });

  useEffect(() => {
    const fetchActiveUsers = async () => {
      const count = await getActiveUsersCount();
      // Always show at least 1 if user is logged in (yourself)
      // This prevents showing 0 due to race conditions on page load
      setActiveUsers(user ? Math.max(1, count) : count);
      setIsLoading(false);
    };

    // Small delay on initial load to let activity tracking write first
    // This reduces the chance of race conditions
    const initialTimeout = setTimeout(fetchActiveUsers, 500);

    // Refresh every 30 seconds
    const interval = setInterval(fetchActiveUsers, 30 * 1000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [user]);

  const handleHide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHidden(true);
    localStorage.setItem('hideLiveIndicator', 'true');
  };

  const handleShow = () => {
    setIsHidden(false);
    localStorage.setItem('hideLiveIndicator', 'false');
  };

  if (isLoading) return null;

  // Navbar variant - compact for mobile with hide/show toggle
  if (variant === 'navbar') {
    // Show compact "Show" button if hidden
    if (isHidden) {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShow}
                className="hidden sm:flex h-8 w-8 rounded-full"
                aria-label="Show live community indicator"
              >
                <Eye className="h-4 w-4 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-card border">
              <p className="text-sm">Show live community</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 group hover:bg-green-500/20 transition-colors relative">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <div className="absolute inset-0 h-2 w-2 rounded-full bg-green-500 animate-ping" />
              </div>
              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                {activeUsers} online
              </span>
              <button
                onClick={handleHide}
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 -mr-1 hover:bg-green-500/30 rounded-full p-0.5"
                aria-label="Hide indicator"
              >
                <X className="h-3 w-3 text-green-600 dark:text-green-400" />
              </button>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-card border">
            <p className="font-semibold">🔥 Active Community</p>
            <p className="text-sm text-muted-foreground">
              {activeUsers === 1 ? (
                "You're grinding solo right now! 💪"
              ) : (
                <>
                  You and <span className="text-primary font-semibold">{activeUsers - 1}</span> {activeUsers === 2 ? 'hunter' : 'hunters'} grinding together ❤️‍🔥
                </>
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-1 italic">
              Click the X to hide this indicator
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Footer variant - visible on mobile
  if (variant === 'footer') {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <div className="absolute inset-0 h-2 w-2 rounded-full bg-green-500 animate-ping opacity-75" />
              </div>
              <span>{activeUsers} active hunters</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-card border">
            <p className="text-sm">
              {activeUsers === 1 ? (
                "You're grinding solo! 💪"
              ) : (
                <>
                  You and <span className="text-primary font-semibold">{activeUsers - 1}</span> {activeUsers === 2 ? 'hunter' : 'hunters'} grinding together ❤️‍🔥
                </>
              )}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Profile variant - detailed stats
  if (variant === 'profile') {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20">
          <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
          <div className="absolute">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Active Community</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeUsers}</p>
          <p className="text-xs text-muted-foreground">
            {activeUsers === 1 ? 'Just you right now' : `${activeUsers} hunters`} online (last 5 min) ❤️‍🔥
          </p>
        </div>
      </div>
    );
  }

  return null;
}
