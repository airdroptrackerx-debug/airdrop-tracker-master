
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User } from '@/types/auth';
import { getExperienceLevel } from '@/utils/authUtils';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;

  getExperienceLevel: (taskCount: number) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Since we are not using authentication, we can set a mock user or leave it as null.
    // For this case, we will leave it as null and remove the login functionality.
    setIsLoading(false);
  }, []);



  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signUp: async () => {},
        signIn: async () => {},
        signOut: async () => {},
        getExperienceLevel
      }}
    >
      {children}
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
