import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Sparkles, Rocket } from 'lucide-react';
import { Button } from './ui/button';

export function WelcomeBanner() {
  const { userProfile } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    if (!userProfile) return;

    const firstLoginKey = `first-login-${userProfile.uid}`;
    const newUserDismissedKey = `new-user-welcome-dismissed-${userProfile.uid}`;
    const sessionKey = `session-welcome-shown-${userProfile.uid}`;
    
    // Check if this is user's first login ever
    const hasLoggedInBefore = localStorage.getItem(firstLoginKey);
    
    if (!hasLoggedInBefore) {
      // First time login - mark as new user
      localStorage.setItem(firstLoginKey, 'true');
      setIsNewUser(true);
      setIsVisible(true);
      return;
    }

    // For returning users
    const accountAge = Date.now() - new Date(userProfile.createdAt).getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    const isStillNew = accountAge < twentyFourHours;
    
    if (isStillNew && !localStorage.getItem(newUserDismissedKey)) {
      // Still within first 24 hours and haven't dismissed new user message
      setIsNewUser(true);
      setIsVisible(true);
      return;
    }

    // Returning user - show welcome back message once per session
    const hasShownThisSession = sessionStorage.getItem(sessionKey);
    
    if (!hasShownThisSession) {
      sessionStorage.setItem(sessionKey, 'true');
      setIsNewUser(false);
      setIsVisible(true);

      // Auto-hide after 8 seconds for returning users
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [userProfile]);

  const handleDismiss = () => {
    if (userProfile && isNewUser) {
      // Only save dismissal for new users permanently
      localStorage.setItem(`new-user-welcome-dismissed-${userProfile.uid}`, 'true');
    }
    setIsVisible(false);
  };

  if (!isVisible || !userProfile) return null;

  return (
    <div className="relative">
      {isNewUser ? (
        // New User Welcome
        <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 border-b border-primary/30 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Rocket className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  Welcome aboard, {userProfile.nickname}!
                </h3>
                <p className="text-sm text-muted-foreground">
                  This is the beginning of your crypto airdrop journey. Track your tasks, stay consistent, 
                  and never miss an opportunity to earn rewards. Your future self will thank you! 🚀
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="flex-shrink-0 h-8 w-8 rounded-full hover:bg-primary/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Returning User Welcome
        <div className="bg-gradient-to-r from-accent/10 to-primary/10 border-b border-border/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">
                👋 Welcome back, <span className="text-primary font-semibold">{userProfile.nickname}</span>! 
                Ready to crush some tasks today?
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="flex-shrink-0 h-7 w-7 rounded-full hover:bg-primary/10"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
