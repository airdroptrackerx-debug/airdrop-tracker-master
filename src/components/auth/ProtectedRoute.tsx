import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, userProfile, isLoading } = useAuth();
  const location = useLocation();
  const firebaseUser = auth.currentUser;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if email is verified for email/password users
  // Social auth users (Google, Twitter) are pre-verified
  if (firebaseUser && !firebaseUser.emailVerified) {
    const provider = userProfile?.provider || '';
    // Only require email verification for password-based signups
    if (provider === 'password' && location.pathname !== '/verify-email') {
      return <Navigate to="/verify-email" replace />;
    }
  }

  return <>{children}</>;
}
