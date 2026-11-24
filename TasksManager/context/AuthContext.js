import {supabase} from '../lib/supabase';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  getSession,
  onAuthChange,
} from '../services/authService';

// Create Context
const AuthContext = createContext(null);

// Provider Component
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Listen to authentication changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    // Check existing session
    const initialize = async () => {
      const { data, error } = await getSession();

      if (!mounted) return;

      if (error) {
        console.log(error.message);
      }

      setSession(data?.session ?? null);
      setUser(data?.session?.user ?? null);
      setLoading(false);
    };

    initialize();

    // Cleanup
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook
export function useAuth() {
  return useContext(AuthContext);
}
