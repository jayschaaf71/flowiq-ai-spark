
import { useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  });
  const { toast } = useToast();

  const handleAuthError = useCallback((error: AuthError | null) => {
    if (error) {
      console.error('Authentication error:', error);
      
      // Show user-friendly error messages
      const friendlyMessage = getFriendlyErrorMessage(error);
      toast({
        title: "Authentication Error",
        description: friendlyMessage,
        variant: "destructive",
      });
    }
    
    setAuthState(prev => ({ ...prev, error, loading: false }));
  }, [toast]);

  const handleAuthStateChange = useCallback((session: Session | null) => {
    setAuthState(prev => ({
      ...prev,
      user: session?.user ?? null,
      session,
      loading: false,
      error: null
    }));
  }, []);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You have been signed out successfully.",
          });
        }

        handleAuthStateChange(session);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          handleAuthError(error);
        } else {
          handleAuthStateChange(session);
        }
      } catch (error) {
        if (!mounted) return;
        console.error('Failed to get initial session:', error);
        setAuthState(prev => ({ ...prev, loading: false, error: error as AuthError }));
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleAuthError, handleAuthStateChange, toast]);

  return authState;
};

// Helper function to provide user-friendly error messages
const getFriendlyErrorMessage = (error: AuthError): string => {
  switch (error.message) {
    case 'Invalid login credentials':
      return 'Invalid email or password. Please check your credentials and try again.';
    case 'Email not confirmed':
      return 'Please check your email and confirm your account before signing in.';
    case 'User already registered':
      return 'An account with this email already exists. Please sign in instead.';
    case 'Signup disabled':
      return 'New account registration is currently disabled. Please contact support.';
    case 'Password should be at least 6 characters':
      return 'Password must be at least 6 characters long.';
    default:
      return error.message || 'An authentication error occurred. Please try again.';
  }
};
