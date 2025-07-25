
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthPage } from './AuthPage';
import { AuthLoadingState } from './AuthLoadingState';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'patient' | 'staff' | 'practice_admin' | 'platform_admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  console.log('🔐 ProtectedRoute: Auth state check', {
    path: location.pathname,
    requiredRole,
    hasUser: !!user,
    hasProfile: !!profile,
    loading,
    userRole: profile?.role,
    userId: user?.id
  });

  // Temporarily disable redirects to test for infinite loop
  // useEffect(() => {
  //   // Only redirect after loading is complete and we have user data
  //   if (!loading && user && profile) {
  //     console.log('ProtectedRoute: User authenticated with role:', profile.role, 'at path:', location.pathname);
  //     
  //     // Role-based redirect logic
  //     if (profile.role === 'patient') {
  //       // Patients can only access patient areas
  //       if (requiredRole === 'staff') {
  //         console.log('Patient trying to access staff area, redirecting to patient dashboard');
  //         navigate('/patient-dashboard', { replace: true });
  //         return;
  //       }
  //       // If patient is on main dashboard, redirect to patient dashboard
  //       if (location.pathname === '/dashboard') {
  //         console.log('Patient on main dashboard, redirecting to patient dashboard');
  //         navigate('/patient-dashboard', { replace: true });
  //         return;
  //       }
  //     } else if (['staff', 'provider', 'practice_manager', 'practice_admin', 'platform_admin'].includes(profile.role)) {
  //       // Staff can access staff areas
  //       if (location.pathname === '/patient-dashboard') {
  //         console.log('Staff trying to access patient dashboard, redirecting to staff dashboard');
  //         navigate('/staff-dashboard', { replace: true });
  //         return;
  //       }
  //       // If staff is on main dashboard without specific role requirement, redirect to staff dashboard
  //       if (location.pathname === '/dashboard' && !requiredRole) {
  //         console.log('Staff on main dashboard, redirecting to staff dashboard');
  //         navigate('/staff-dashboard', { replace: true });
  //         return;
  //       }
  //     }
  //   }
  // }, [user, profile, loading, navigate, location.pathname, requiredRole]);

  // Show loading state while checking authentication
  if (loading) {
    return <AuthLoadingState message="Verifying secure access..." />;
  }

  // Show auth page if not authenticated
  if (!user) {
    return <AuthPage />;
  }

  // Show loading if we have user but no profile yet
  if (user && !profile) {
    return <AuthLoadingState message="Setting up your profile..." />;
  }

  // HIPAA Compliance: Role-based access control
  if (requiredRole && profile) {
    const hasAccess = () => {
      switch (requiredRole) {
        case 'platform_admin':
          return profile.role === 'platform_admin';
        case 'practice_admin':
          return profile.role === 'practice_admin' || profile.role === 'platform_admin';
        case 'staff':
          return ['staff', 'provider', 'practice_manager', 'practice_admin', 'platform_admin'].includes(profile.role);
        case 'patient':
          return true; // All authenticated users can access patient areas
        default:
          return false;
      }
    };

    if (!hasAccess()) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <div className="font-medium mb-2">Access Denied</div>
                <p>You do not have sufficient privileges to access this area. This incident has been logged for security purposes.</p>
                <div className="mt-4 text-xs text-red-600">
                  Required Role: {requiredRole} | Your Role: {profile.role}
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};
