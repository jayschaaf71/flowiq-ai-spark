
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '@/hooks/useAuthState';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
  tenant_id?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string, role?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  switchRole: (newRole: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session, loading: authLoading } = useAuthState();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const { toast } = useToast();

  const loading = authLoading || profileLoading;

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      setProfileLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      // If no profile exists, create a default one
      if (!data) {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: userId,
            first_name: user?.user_metadata?.first_name || '',
            last_name: user?.user_metadata?.last_name || '',
            contact_email: user?.email || ''
          }])
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          return null;
        }
        return {
          id: newProfile.id,
          email: user?.email || '',
          first_name: newProfile.first_name,
          last_name: newProfile.last_name,
          role: 'patient'
        };
      }

      return {
        id: data.id,
        email: user?.email || '',
        first_name: data.first_name,
        last_name: data.last_name, 
        role: 'patient' // Default role since profiles table doesn't have role field
      };
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      return null;
    } finally {
      setProfileLoading(false);
    }
  };

  // Update profile when user changes
  useEffect(() => {
    if (user) {
      fetchProfile(user.id).then(setProfile);
    } else {
      setProfile(null);
    }
  }, [user]);

  const refreshProfile = async () => {
    if (user) {
      const updatedProfile = await fetchProfile(user.id);
      setProfile(updatedProfile);
    }
  };

  const switchRole = async (newRole: string) => {
    if (!user || !profile) return;

    try {
      // Mock role switching since profiles table doesn't have role field
      console.log('Role switching requested:', newRole);

      // Update local profile
      setProfile({ ...profile, role: newRole });
      
      toast({
        title: "Role Switched",
        description: `Successfully switched to ${newRole} role.`,
      });
    } catch (error) {
      console.error('Unexpected error switching role:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
      }
      
      return { error };
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string, role?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role || 'patient'
          }
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
      }
      
      return { error };
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign Out Error",
        description: "There was an issue signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    switchRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
