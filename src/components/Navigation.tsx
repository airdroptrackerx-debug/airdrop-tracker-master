'use client';

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { Moon, Sun, User, BookOpen, LogOut, AlertTriangle } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useNavigate } from "react-router-dom";
import GuidelinesDrawer from "./GuidelinesDrawer";
import { NotificationBell } from "./NotificationBell";
import { LiveCommunityIndicator } from "./LiveCommunityIndicator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function Navigation() {
  const { user, userProfile, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    console.log('Toggling theme to:', newTheme);
    setTheme(newTheme);
  };

  const handleSignOutClick = () => {
    setShowSignOutDialog(true);
  };

  const handleConfirmSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
      setShowSignOutDialog(false);
    }
  };

  // Public navigation for unauthenticated users (About, Donate, Privacy pages)
  if (!user) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-3 sm:px-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="font-semibold cursor-pointer text-sm sm:text-base truncate" onClick={() => navigate('/')}>
              Airdrop Tracker
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button variant="outline" onClick={() => navigate('/login')} size="sm" className="text-xs sm:text-sm">
              Sign In
            </Button>
          </div>
        </div>
      </header>
    );
  }

  // Authenticated user navigation
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-3 sm:px-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="font-semibold cursor-pointer text-sm sm:text-base truncate" onClick={() => navigate('/')}>
            Airdrop Tracker
          </div>
          {userProfile && (
            <span className="text-xs sm:text-sm text-muted-foreground hidden xs:inline truncate">
              Welcome, {userProfile.nickname}!
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 flex-shrink-0">
          <LiveCommunityIndicator variant="navbar" />
          <GuidelinesDrawer>
            <Button
              variant="ghost"
              size="icon"
              aria-label="View Guidelines"
              className="rounded-full"
            >
              <BookOpen className="h-5 w-5" />
            </Button>
          </GuidelinesDrawer>
          <NotificationBell />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
            aria-label="View Profile"
            className="rounded-full"
          >
            <User className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-full"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button variant="outline" onClick={handleSignOutClick} size="sm" className="text-xs sm:text-sm">
            Sign Out
          </Button>
        </div>
      </div>

      {/* Sign Out Confirmation Dialog */}
      <Dialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
              </div>
              <DialogTitle className="text-xl">Sign Out?</DialogTitle>
            </div>
            <DialogDescription className="text-base pt-2">
              Are you sure you want to sign out of your account? You'll need to log in again to access your tasks.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowSignOutDialog(false)}
              disabled={isSigningOut}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? (
                <>
                  <LogOut className="mr-2 h-4 w-4 animate-pulse" />
                  Signing out...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Yes, Sign Out
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
