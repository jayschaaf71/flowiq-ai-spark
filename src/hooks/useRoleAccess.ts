import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';

export type AppRole = 
  | 'platform_admin'
  | 'practice_admin' 
  | 'practice_manager'
  | 'provider'
  | 'staff'
  | 'billing'
  | 'patient';

interface RoleAccess {
  role: AppRole | null;
  isPlatformAdmin: boolean;
  isPracticeAdmin: boolean;
  hasStaffAccess: boolean;
  canAccessPlatformAdmin: boolean;
  isLoading: boolean;
}

export const useRoleAccess = (): RoleAccess => {
  const { user } = useAuth();
  const [roleAccess, setRoleAccess] = useState<RoleAccess>({
    role: null,
    isPlatformAdmin: false,
    isPracticeAdmin: false,
    hasStaffAccess: false,
    canAccessPlatformAdmin: false,
    isLoading: true,
  });

  useEffect(() => {
    const checkRoleAccess = async () => {
      if (!user) {
        setRoleAccess({
          role: null,
          isPlatformAdmin: false,
          isPracticeAdmin: false,
          hasStaffAccess: false,
          canAccessPlatformAdmin: false,
          isLoading: false,
        });
        return;
      }

      try {
        // Get user role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        const userRole = profile?.role as AppRole;

        // Check platform admin access
        const { data: isPlatformAdminData } = await supabase
          .rpc('is_platform_admin', { user_id: user.id });

        // Check practice admin access
        const { data: isPracticeAdminData } = await supabase
          .rpc('is_practice_admin', { user_id: user.id });

        // Check staff access
        const { data: hasStaffAccessData } = await supabase
          .rpc('has_staff_access', { user_id: user.id });

        // Check if can access platform admin specifically
        const { data: canAccessPlatformAdminData } = await supabase
          .rpc('can_access_platform_admin', { user_id: user.id });

        setRoleAccess({
          role: userRole,
          isPlatformAdmin: isPlatformAdminData || false,
          isPracticeAdmin: isPracticeAdminData || false,
          hasStaffAccess: hasStaffAccessData || false,
          canAccessPlatformAdmin: canAccessPlatformAdminData || false,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error checking role access:', error);
        setRoleAccess({
          role: null,
          isPlatformAdmin: false,
          isPracticeAdmin: false,
          hasStaffAccess: false,
          canAccessPlatformAdmin: false,
          isLoading: false,
        });
      }
    };

    checkRoleAccess();
  }, [user]);

  return roleAccess;
};