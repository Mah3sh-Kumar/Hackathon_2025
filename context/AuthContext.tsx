import React, { createContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { db } from '../utils/databaseClient';

// Define error type for consistency
type AuthError = Error | null;

// Define the shape of our auth context
export type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError }>;
  signUp: (email: string, password: string, userData?: object) => Promise<{ error: AuthError, user: User | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError }>;
  updateProfile: (data: { username?: string, avatar_url?: string }) => Promise<{ error: AuthError }>;
  updateSellerStatus: (userId: string) => Promise<void>;
  isSeller: boolean;
  isAuthenticated: boolean;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, user: null }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null }),
  updateProfile: async () => ({ error: null }),
  updateSellerStatus: async () => {},
  isSeller: false,
  isAuthenticated: false,
});

export { AuthContext };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSeller, setIsSeller] = useState<boolean>(false);

  useEffect(() => {
    // Get the current session and set up a listener for auth changes
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await db.getSession();
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Check if user is a seller by querying the sellers table
          const { data } = await db.getSellerProfile(session.user.id);
          setIsSeller(!!data);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up a listener for auth state changes using localStorage events if Supabase is not available
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'currentUser') {
        getInitialSession();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Define auth methods
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await db.signIn(email, password);
      
      if (!error && data.user) {
        setUser(data.user);
        setSession({ user: data.user } as Session);
        
        // Check if user is a seller
        const sellerResponse = await db.getSellerProfile(data.user.id);
        setIsSeller(!!sellerResponse.data);
      }
      
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const updateSellerStatus = async (userId: string) => {
    try {
      const sellerResponse = await db.getSellerProfile(userId);
      setIsSeller(!!sellerResponse.data);
    } catch (err: any) {
      console.error('Error updating seller status:', err);
    }
  };

  const signUp = async (email: string, password: string, userData?: object) => {
    try {
      const { data, error } = await db.signUp(email, password, userData);
      return { error, user: data?.user || null };
    } catch (err: any) {
      return { error: err, user: null };
    }
  };

  const signOut = async () => {
    await db.signOut();
    setUser(null);
    setSession(null);
    setIsSeller(false);
  };

  const resetPassword = async (email: string) => {
    try {
      // This functionality might be limited in localStorage mode
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const updateProfile = async (data: { username?: string, avatar_url?: string }) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      // This functionality might be limited in localStorage mode
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    updateSellerStatus,
    isSeller,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};