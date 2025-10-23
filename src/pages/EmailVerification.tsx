import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw, Check, AlertCircle, LogOut, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function EmailVerification() {
  const { user, sendVerificationEmail, signOut } = useAuth();
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Check verification status every 3 seconds
  useEffect(() => {
    const firebaseUser = auth.currentUser;
    
    if (!firebaseUser || !user) {
      navigate('/login');
      return;
    }

    // If already verified, redirect to home
    if (firebaseUser.emailVerified) {
      navigate('/');
      return;
    }

    const checkInterval = setInterval(async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          await currentUser.reload(); // Reload user data from Firebase
          if (currentUser.emailVerified) {
            console.log('Email verified! Redirecting...');
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(checkInterval);
  }, [user, navigate]);

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendError('');
    setResendSuccess(false);

    try {
      await sendVerificationEmail();
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (error: any) {
      setResendError(error.message || 'Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckNow = async () => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return;
    
    setIsChecking(true);
    try {
      await firebaseUser.reload();
      if (firebaseUser.emailVerified) {
        navigate('/');
      } else {
        setResendError('Email not verified yet. Please check your inbox and click the verification link.');
        setTimeout(() => setResendError(''), 3000);
      }
    } catch (error) {
      console.error('Error checking verification:', error);
    } finally {
      setIsChecking(false);
    }
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/5 p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 text-center border-b">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>
            <p className="text-sm text-muted-foreground">
              We've sent a verification link to
            </p>
            <p className="font-medium text-sm mt-1">{user.email}</p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Instructions */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900 dark:text-blue-100">
                  <p className="font-medium mb-1">Check your inbox</p>
                  <p className="text-blue-700 dark:text-blue-300">
                    Click the verification link in the email to activate your account.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-900 dark:text-yellow-100">
                  <p className="font-medium mb-1">Can't find it?</p>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    Check your <strong>spam/junk folder</strong>. The email might take a few minutes to arrive.
                  </p>
                </div>
              </div>
            </div>

            {/* Success/Error Messages */}
            {resendSuccess && (
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <Check className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-900 dark:text-green-100">
                  Verification email sent! Check your inbox.
                </p>
              </div>
            )}

            {resendError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-sm text-red-900 dark:text-red-100">
                  {resendError}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleCheckNow}
                disabled={isChecking}
                className="w-full"
                variant="default"
              >
                {isChecking ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    I've Verified - Check Now
                  </>
                )}
              </Button>

              <Button
                onClick={handleResendEmail}
                disabled={isResending || resendSuccess}
                className="w-full"
                variant="outline"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Resend Verification Email
                  </>
                )}
              </Button>
            </div>

            {/* Auto-check notice */}
            <p className="text-xs text-center text-muted-foreground">
              <RefreshCw className="inline h-3 w-3 mr-1" />
              Auto-checking every 3 seconds...
            </p>

            {/* Sign out option */}
            <div className="pt-4 border-t">
              <button
                onClick={handleSignOutClick}
                className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out and try a different email
              </button>
            </div>
          </div>
        </div>

        {/* Additional help */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Having trouble? Contact us at{' '}
            <a
              href="mailto:airdrop.tracker.1.0@gmail.com"
              className="text-primary hover:underline"
            >
              airdrop.tracker.1.0@gmail.com
            </a>
          </p>
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
              Are you sure you want to sign out? Your email verification is in progress. You can continue verifying after logging back in.
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
    </div>
  );
}
