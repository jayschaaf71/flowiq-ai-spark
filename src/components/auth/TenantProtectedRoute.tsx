
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthPage } from './AuthPage';
import { AuthLoadingState } from './AuthLoadingState';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logPermissionDenied, logAuthFailure } from '@/utils/productionLogging';

interface TenantProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'patient' | 'staff' | 'practice_admin' | 'platform_admin';
  allowPatients?: boolean;
}

export const TenantProtectedRoute: React.FC<TenantProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  allowPatients = false
}) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user && profile) {
      console.log('TenantProtectedRoute: User authenticated with role:', profile.role, 'at path:', location.pathname);
      
      // If user is a patient and trying to access staff areas, redirect to patient dashboard
      if (profile.role === 'patient' && requiredRole && requiredRole !== 'patient' && !allowPatients) {
        console.log('Patient trying to access staff area, redirecting to patient dashboard');
        logPermissionDenied(requiredRole, profile.role, location.pathname);
        navigate('/patient-dashboard', { replace: true });
        return;
      }
      
      // If user is staff and trying to access patient-only areas, redirect to main dashboard
      if (['staff', 'provider', 'practice_manager', 'practice_admin', 'platform_admin'].includes(profile.role) && location.pathname === '/patient-dashboard') {
        console.log('Staff trying to access patient dashboard, redirecting to main dashboard');
        navigate('/', { replace: true });
        return;
      }
    }
  }, [user, profile, loading, navigate, requiredRole, allowPatients, location.pathname]);

  // Show loading state while checking authentication
  if (loading) {
    return <AuthLoadingState message="Verifying secure access..." />;
  }

  // Show auth page if not authenticated
  if (!user) {
    logAuthFailure('No user session found', { path: location.pathname });
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
          return ['practice_admin', 'platform_admin'].includes(profile.role);
        case 'staff':
          return ['staff', 'provider', 'practice_manager', 'practice_admin', 'platform_admin'].includes(profile.role);
        case 'patient':
          return allowPatients || profile.role === 'patient';
        default:
          return false;
      }
    };

    if (!hasAccess()) {
      logPermissionDenied(requiredRole, profile.role, location.pathname);
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full">
            <Alert className="border-destructive/50 bg-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive">
                <div className="font-medium mb-2">Access Denied</div>
                <p>You do not have sufficient privileges to access this area. This incident has been logged for security purposes.</p>
                <div className="mt-4 text-xs opacity-75">
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
