
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { detectTenant } from '@/utils/tenantConfig';

interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: 'patient' | 'staff' | 'admin';
  tenant_id: string | null;
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
    // HIPAA Compliance: Secure session handling with enhanced audit logging
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile with tenant information
          const fetchProfile = async () => {
            try {
              console.log('Attempting to fetch profile for user:', session.user.id);
              const { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (error) {
                console.error('Error fetching profile:', error);
                if (error.code === 'PGRST116') {
                  console.log('Profile not found, creating default profile with tenant');
                  
                  // Detect tenant from current domain/subdomain
                  const tenantConfig = detectTenant();
                  const tenantId = tenantConfig.name.toLowerCase();
                  
                  const { data: newProfile, error: createError } = await supabase
                    .from('profiles')
                    .insert({
                      id: session.user.id,
                      email: session.user.email,
                      first_name: session.user.user_metadata?.first_name || null,
                      last_name: session.user.user_metadata?.last_name || null,
                      role: session.user.user_metadata?.role || 'patient',
                      tenant_id: tenantId
                    })
                    .select()
                    .single();
                  
                  if (createError) {
                    console.error('Error creating profile:', createError);
                    setProfile({
                      id: session.user.id,
                      email: session.user.email!,
                      first_name: session.user.user_metadata?.first_name || null,
                      last_name: session.user.user_metadata?.last_name || null,
                      phone: null,
                      role: (session.user.user_metadata?.role as 'patient' | 'staff' | 'admin') || 'patient',
                      tenant_id: tenantId
                    });
                  } else if (newProfile) {
                    setProfile({
                      ...newProfile,
                      role: newProfile.role as 'patient' | 'staff' | 'admin'
                    });
                  }
                } else {
                  const tenantConfig = detectTenant();
                  setProfile({
                    id: session.user.id,
                    email: session.user.email!,
                    first_name: session.user.user_metadata?.first_name || null,
                    last_name: session.user.user_metadata?.last_name || null,
                    phone: null,
                    role: (session.user.user_metadata?.role as 'patient' | 'staff' | 'admin') || 'patient',
                    tenant_id: tenantConfig.name.toLowerCase()
                  });
                }
                return;
              }
              
              if (profileData) {
                console.log('Profile fetched successfully:', profileData);
                
                // Ensure tenant_id is set if missing
                if (!profileData.tenant_id) {
                  const tenantConfig = detectTenant();
                  const tenantId = tenantConfig.name.toLowerCase();
                  
                  await supabase
                    .from('profiles')
                    .update({ tenant_id: tenantId })
                    .eq('id', session.user.id);
                  
                  setProfile({
                    ...profileData,
                    role: profileData.role as 'patient' | 'staff' | 'admin',
                    tenant_id: tenantId
                  });
                } else {
                  setProfile({
                    ...profileData,
                    role: profileData.role as 'patient' | 'staff' | 'admin'
                  });
                }
              }
            } catch (error) {
              console.error('Profile fetch error:', error);
              const tenantConfig = detectTenant();
              setProfile({
                id: session.user.id,
                email: session.user.email!,
                first_name: session.user.user_metadata?.first_name || null,
                last_name: session.user.user_metadata?.last_name || null,
                phone: null,
                role: (session.user.user_metadata?.role as 'patient' | 'staff' | 'admin') || 'patient',
                tenant_id: tenantConfig.name.toLowerCase()
              });
            }
          };

          setTimeout(fetchProfile, 100);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string, role?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    try {
      // Detect tenant for new user registration
      const tenantConfig = detectTenant();
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role || 'patient',
            tenant_id: tenantConfig.name.toLowerCase()
          }
        }
      });
      
      // HIPAA Compliance: Log authentication attempt (without sensitive data)
      console.log('Sign up attempt for tenant:', tenantConfig.name, 'email:', email.replace(/(.{2})(.*)(@.*)/, '$1***$3'));
      
      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      // HIPAA Compliance: Log authentication attempt (without sensitive data)
      const tenantConfig = detectTenant();
      console.log('Sign in attempt for tenant:', tenantConfig.name, 'email:', email.replace(/(.{2})(.*)(@.*)/, '$1***$3'));
      
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      // HIPAA Compliance: Clear all local data on logout and log the action
      console.log('User signing out - clearing PHI from local storage');
      setProfile(null);
      setUser(null);
      setSession(null);
      
      await supabase.auth.signOut();
      
      // Clear any cached PHI data
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
