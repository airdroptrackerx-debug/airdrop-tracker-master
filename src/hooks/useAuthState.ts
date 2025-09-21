
import { useState, useEffect } from 'react';
import { AuthState, User } from '@/types/auth';

// Local storage key for session persistence
export const SESSION_STORAGE_KEY = 'airdrop_tracker_session';

export function useAuthState() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
  });
  
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline'>(
    typeof navigator !== 'undefined' && navigator.onLine ? 'online' : 'offline'
  );

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setNetworkStatus('online');
    const handleOffline = () => setNetworkStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check for active session in local storage
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if we have a saved session in localStorage
        const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
        if (savedSession) {
          try {
            // Try to restore the session
            const parsedSession = JSON.parse(savedSession);
            if (parsedSession && parsedSession.user) {
              setAuthState({
                user: parsedSession.user,
                session: parsedSession,
                isLoading: false,
              });
              return;
            }
          } catch (e) {
            console.error("Failed to parse saved session:", e);
            localStorage.removeItem(SESSION_STORAGE_KEY);
          }
        }
        
        // No valid session found
        setAuthState(prev => ({ ...prev, isLoading: false }));
      } catch (error: any) {
        console.error('Error checking auth session:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkSession();
  }, []);

  return { authState, setAuthState, networkStatus };
}
