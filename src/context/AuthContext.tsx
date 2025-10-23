
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  TwitterAuthProvider,
  sendEmailVerification,
  linkWithPopup,
  linkWithCredential,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, deleteDoc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User } from '../types/auth';
import { UserProfile } from '../types/user';
import { getExperienceLevel } from '../utils/authUtils';
import { updateStreakOnLogin } from '../utils/streakSystem';
import { getLevelInfo, didLevelUp } from '../utils/levelingSystem';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signUp: (email: string, password: string, name: string, nickname: string, recaptchaToken?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithTwitter: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  linkGoogleAccount: () => Promise<void>;
  linkTwitterAccount: () => Promise<void>;
  getExperienceLevel: (taskCount: number) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'
        });
        
        // Fetch user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const profileData = userDoc.data();
            
            // Update streak on login
            const streakResult = updateStreakOnLogin();
            
            // Save updated streak to Firestore
            if (streakResult.didIncrease || streakResult.didReset) {
              await setDoc(doc(db, 'users', firebaseUser.uid), {
                streakData: streakResult.data,
                lastStreakUpdate: new Date()
              }, { merge: true });
              
              console.log('Streak updated:', streakResult.data);
              
              // Log milestone achievement (notification will be triggered by NotificationContext)
              if (streakResult.achievedMilestone) {
                console.log(`🎉 Milestone achieved: ${streakResult.achievedMilestone} days!`);
                
                // Store milestone event for notification
                localStorage.setItem('streak_milestone_achieved', JSON.stringify({
                  milestone: streakResult.achievedMilestone,
                  timestamp: Date.now()
                }));
              }
            }
            
            setUserProfile({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: profileData.name,
              nickname: profileData.nickname,
              photoURL: profileData.photoURL || firebaseUser.photoURL,
              emailVerified: firebaseUser.emailVerified,
              provider: profileData.provider,
              linkedProviders: profileData.linkedProviders || [],
              isAdmin: profileData.isAdmin || false,
              streakData: streakResult.data,
              lastStreakUpdate: new Date(),
              createdAt: profileData.createdAt?.toDate() || new Date(),
              updatedAt: profileData.updatedAt?.toDate() || new Date(),
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      // Set persistence based on Remember Me checkbox
      if (rememberMe) {
        await setPersistence(auth, browserLocalPersistence); // Stay signed in
      } else {
        await setPersistence(auth, browserSessionPersistence); // Sign out on browser close
      }
      
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      let errorMessage = 'Failed to sign in. Please try again.';
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up first.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid credentials. Please check your email and password.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later or reset your password.';
      }
      throw new Error(errorMessage);
    }
  };

  const signUp = async (email: string, password: string, name: string, nickname: string, recaptchaToken?: string) => {
    try {
      // Note: reCAPTCHA token verification would happen server-side in production
      // For now, we'll just log it for development purposes
      if (recaptchaToken) {
        console.log('reCAPTCHA token received (would verify server-side in production)');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Send email verification
      try {
        await sendEmailVerification(user);
        console.log('Verification email sent to:', email);
      } catch (verifyError) {
        console.error('Failed to send verification email:', verifyError);
        // Don't throw error - allow signup to complete even if email fails
      }
      
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        nickname,
        email,
        photoURL: null,
        emailVerified: false,
        provider: 'password',
        linkedProviders: ['password'],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      let errorMessage = 'Failed to create account. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters long.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      }
      throw new Error(errorMessage);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...updates,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      
      // Update local state
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          ...updates,
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent successfully to:', email);
    } catch (error: any) {
      console.error('Password reset error:', error);
      let errorMessage = 'Failed to send reset email. Please try again.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/missing-email') {
        errorMessage = 'Please enter your email address.';
      }
      console.error('Error code:', error.code, 'Message:', error.message);
      throw new Error(errorMessage);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser || !firebaseUser.email) {
      throw new Error('No user logged in');
    }

    try {
      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(
        firebaseUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(firebaseUser, credential);
      
      // Update password
      await updatePassword(firebaseUser, newPassword);
    } catch (error: any) {
      console.error('Change password error:', error);
      let errorMessage = 'Failed to change password. Please try again.';
      
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Current password is incorrect.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'New password should be at least 6 characters long.';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Please log out and log in again before changing your password.';
      }
      
      throw new Error(errorMessage);
    }
  };

  const deleteAccount = async (password: string) => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser || !firebaseUser.email) {
      throw new Error('No user logged in');
    }

    try {
      // Re-authenticate user before deletion
      const credential = EmailAuthProvider.credential(
        firebaseUser.email,
        password
      );
      await reauthenticateWithCredential(firebaseUser, credential);
      
      // Delete user data from Firestore
      const userId = firebaseUser.uid;
      
      // Delete user profile
      await deleteDoc(doc(db, 'users', userId));
      
      // Delete all user tasks
      const tasksQuery = query(
        collection(db, 'tasks'),
        where('userId', '==', userId)
      );
      const tasksSnapshot = await getDocs(tasksQuery);
      
      // Use batch delete for efficiency
      const batch = writeBatch(db);
      tasksSnapshot.docs.forEach((taskDoc) => {
        batch.delete(taskDoc.ref);
      });
      await batch.commit();
      
      // Delete Firebase Auth account
      await deleteUser(firebaseUser);
    } catch (error: any) {
      console.error('Delete account error:', error);
      let errorMessage = 'Failed to delete account. Please try again.';
      
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Please log out and log in again before deleting your account.';
      }
      
      throw new Error(errorMessage);
    }
  };

  // Helper function to create or update user profile for social auth
  const createOrUpdateSocialProfile = async (firebaseUser: FirebaseUser, providerName: string) => {
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      // If user profile doesn't exist, create it
      if (!userDoc.exists()) {
        const displayName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
        const nickname = displayName.split(' ')[0]; // Use first name as nickname
        
        const profileData = {
          name: displayName,
          nickname: nickname,
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL || null,
          emailVerified: firebaseUser.emailVerified || false,
          provider: providerName,
          linkedProviders: [providerName],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        
        // Log the data we're trying to save
        console.log('Creating new profile with data:', profileData);
        
        await setDoc(userDocRef, profileData);
      } else {
        // Update profile with photo and add provider to linked list
        const currentData = userDoc.data();
        
        console.log('Current user data:', currentData);
        
        // Make sure we don't have undefined in the array
        const existingProviders = currentData.linkedProviders || (currentData.provider ? [currentData.provider] : []);
        const linkedProviders = existingProviders.filter((p: any) => p !== undefined && p !== null);
        if (!linkedProviders.includes(providerName)) {
          linkedProviders.push(providerName);
        }
        
        const updateData = {
          photoURL: firebaseUser.photoURL || currentData.photoURL || null,
          emailVerified: firebaseUser.emailVerified !== undefined ? firebaseUser.emailVerified : (currentData.emailVerified || false),
          provider: currentData.provider || providerName,
          linkedProviders: linkedProviders,
          updatedAt: serverTimestamp(),
        };
        
        // Log the data we're trying to update
        console.log('Updating profile with data:', updateData);
        
        await setDoc(userDocRef, updateData, { merge: true });
      }
    } catch (error: any) {
      console.error('Error in createOrUpdateSocialProfile:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      await createOrUpdateSocialProfile(result.user, 'google.com');
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      let errorMessage = 'Failed to sign in with Google. Please try again.';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in popup was closed. Please try again.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked by your browser. Please enable popups for this site.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Sign-in was cancelled. Please try again.';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with the same email address but different sign-in credentials.';
      }
      
      throw new Error(errorMessage);
    }
  };

  const signInWithApple = async () => {
    try {
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');
      
      const result = await signInWithPopup(auth, provider);
      await createOrUpdateSocialProfile(result.user, 'apple.com');
    } catch (error: any) {
      console.error('Apple sign-in error:', error);
      let errorMessage = 'Failed to sign in with Apple. Please try again.';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in popup was closed. Please try again.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked by your browser. Please enable popups for this site.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Sign-in was cancelled. Please try again.';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with the same email address but different sign-in credentials.';
      }
      
      throw new Error(errorMessage);
    }
  };

  const signInWithTwitter = async () => {
    try {
      const provider = new TwitterAuthProvider();
      
      const result = await signInWithPopup(auth, provider);
      await createOrUpdateSocialProfile(result.user, 'twitter.com');
    } catch (error: any) {
      console.error('X sign-in error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      let errorMessage = 'Failed to sign in with 𝕏. Please try again.';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in popup was closed. Please try again.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked by your browser. Please enable popups for this site.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Sign-in was cancelled. Please try again.';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with the same email address but different sign-in credentials.';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized. Please add it to Firebase Console authorized domains.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = '𝕏 sign-in is not enabled in Firebase Console.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid 𝕏 credentials. Please check your API Key and Secret in Firebase Console.';
      }
      
      // Include actual error for debugging
      errorMessage += ` (Error: ${error.code || 'unknown'})`;
      
      throw new Error(errorMessage);
    }
  };

  // Send email verification
  const sendVerificationEmail = async () => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      throw new Error('No user logged in');
    }

    if (firebaseUser.emailVerified) {
      throw new Error('Email is already verified');
    }

    try {
      await sendEmailVerification(firebaseUser);
      console.log('Verification email sent to:', firebaseUser.email);
    } catch (error: any) {
      console.error('Send verification error:', error);
      let errorMessage = 'Failed to send verification email. Please try again.';
      
      if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please wait a few minutes before trying again.';
      }
      
      throw new Error(errorMessage);
    }
  };

  // Link Google account to existing account
  const linkGoogleAccount = async () => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      throw new Error('No user logged in');
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await linkWithPopup(firebaseUser, provider);
      
      // Update Firestore profile with linked provider
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const currentData = userDoc.data();
        const linkedProviders = currentData.linkedProviders || [currentData.provider];
        if (!linkedProviders.includes('google.com')) {
          linkedProviders.push('google.com');
        }
        
        await setDoc(userDocRef, {
          photoURL: result.user.photoURL || currentData.photoURL || null,
          linkedProviders: linkedProviders,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }
      
      console.log('Google account linked successfully');
    } catch (error: any) {
      console.error('Link Google account error:', error);
      let errorMessage = 'Failed to link Google account. Please try again.';
      
      if (error.code === 'auth/credential-already-in-use') {
        errorMessage = 'This Google account is already linked to another user.';
      } else if (error.code === 'auth/provider-already-linked') {
        errorMessage = 'Google account is already linked to this account.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Popup was closed. Please try again.';
      }
      
      throw new Error(errorMessage);
    }
  };

  // Link Twitter account to existing account
  const linkTwitterAccount = async () => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      throw new Error('No user logged in');
    }

    try {
      const provider = new TwitterAuthProvider();
      const result = await linkWithPopup(firebaseUser, provider);
      
      // Update Firestore profile with linked provider
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const currentData = userDoc.data();
        const linkedProviders = currentData.linkedProviders || [currentData.provider];
        if (!linkedProviders.includes('twitter.com')) {
          linkedProviders.push('twitter.com');
        }
        
        await setDoc(userDocRef, {
          photoURL: result.user.photoURL || currentData.photoURL || null,
          linkedProviders: linkedProviders,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }
      
      console.log('𝕏 account linked successfully');
    } catch (error: any) {
      console.error('Link 𝕏 account error:', error);
      let errorMessage = 'Failed to link 𝕏 account. Please try again.';
      
      if (error.code === 'auth/credential-already-in-use') {
        errorMessage = 'This 𝕏 account is already linked to another user.';
      } else if (error.code === 'auth/provider-already-linked') {
        errorMessage = '𝕏 account is already linked to this account.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Popup was closed. Please try again.';
      }
      
      throw new Error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isLoading,
        signIn,
        signUp,
        signInWithGoogle,
        signInWithApple,
        signInWithTwitter,
        signOut,
        resetPassword,
        updateUserProfile,
        changePassword,
        deleteAccount,
        sendVerificationEmail,
        linkGoogleAccount,
        linkTwitterAccount,
        getExperienceLevel
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
