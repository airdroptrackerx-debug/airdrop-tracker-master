import { useEffect } from 'react';
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

/**
 * Hook to track user activity for live user count
 */
export function useActivityTracking() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const updateActivity = async () => {
      try {
        await setDoc(doc(db, 'userActivity', user.uid), {
          userId: user.uid,
          lastSeen: serverTimestamp(),
          page: window.location.pathname
        }, { merge: true });
      } catch (error: any) {
        // Only log if it's not a permission error (rules should allow this, but log actual errors)
        if (!error?.message?.includes('Missing or insufficient permissions')) {
          console.error('Error updating activity:', error);
        }
      }
    };

    // Update immediately
    updateActivity();

    // Update every 2 minutes while user is active
    const interval = setInterval(updateActivity, 2 * 60 * 1000);

    // Update on page visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateActivity();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Update before page unload
    const handleBeforeUnload = () => {
      // Final activity update before user leaves
      updateActivity();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user]);
}

/**
 * Get count of active users in last 5 minutes (real-time count)
 * Now available to all authenticated users for community feel!
 */
export async function getActiveUsersCount(): Promise<number> {
  try {
    // Count users active in last 5 minutes (more accurate real-time count)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const q = query(
      collection(db, 'userActivity'),
      where('lastSeen', '>', Timestamp.fromDate(fiveMinutesAgo))
    );
    
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error: any) {
    console.error('Error fetching active users count:', error);
    // If it fails, return 0 but log the actual error
    return 0;
  }
}
