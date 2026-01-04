import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: { full_name?: string; avatar_url?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Check if user is already signed in on app startup
  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await AuthService.getCurrentUserWithProfile();
        if (currentUser) {
          setUser(currentUser);
          setIsSignedIn(true);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: subscription } = AuthService.onAuthStateChange((event, session) => {
      if (session?.user) {
        // Fetch full profile on auth change
        AuthService.getCurrentUserWithProfile()
          .then(userProfile => {
            if (userProfile) {
              setUser(userProfile);
              setIsSignedIn(true);
            }
          })
          .catch(error => {
            console.error('Error fetching user profile:', error);
            setUser(null);
            setIsSignedIn(false);
          });
      } else {
        setUser(null);
        setIsSignedIn(false);
      }
    });

    return () => {
      if (subscription?.subscription) {
        subscription.subscription.unsubscribe();
      }
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setIsLoading(true);
      await AuthService.signUp(email, password, fullName);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await AuthService.signIn(email, password);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await AuthService.signOut();
      setUser(null);
      setIsSignedIn(false);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      await AuthService.resetPassword(email);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: { full_name?: string; avatar_url?: string }) => {
    try {
      setIsLoading(true);
      await AuthService.updateProfile(updates);
      // Update local user state
      if (user) {
        setUser({
          ...user,
          full_name: updates.full_name || user.full_name,
          avatar_url: updates.avatar_url || user.avatar_url,
          updated_at: new Date().toISOString(),
        });
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isSignedIn, signUp, signIn, signOut, resetPassword, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
