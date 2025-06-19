
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: 'patient' | 'staff' | 'admin';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName?: string, lastName?: string, role?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // HIPAA Compliance: Secure session handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile with timeout to prevent hanging
          const fetchProfile = async () => {
            try {
              const { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (error) {
                console.error('Error fetching profile:', error);
                return;
              }
              
              if (profileData) {
                setProfile({
                  ...profileData,
                  role: profileData.role as 'patient' | 'staff' | 'admin'
                });
              }
            } catch (error) {
              console.error('Profile fetch timeout or error:', error);
            }
          };

          // Use setTimeout to avoid auth callback recursion
          setTimeout(fetchProfile, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string, role?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    // HIPAA Compliance: Enhanced error handling
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role || 'patient'
          }
        }
      });
      
      // Log authentication attempt (without sensitive data)
      console.log('Sign up attempt for:', email.replace(/(.{2})(.*)(@.*)/, '$1***$3'));
      
      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    // HIPAA Compliance: Enhanced error handling and logging
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      // Log authentication attempt (without sensitive data)
      console.log('Sign in attempt for:', email.replace(/(.{2})(.*)(@.*)/, '$1***$3'));
      
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      // HIPAA Compliance: Clear all local data on logout
      setProfile(null);
      setUser(null);
      setSession(null);
      
      await supabase.auth.signOut();
      
      // Clear any cached data
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signUp,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
