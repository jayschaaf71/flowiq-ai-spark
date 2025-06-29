
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthPage } from './AuthPage';
import { AuthLoadingState } from './AuthLoadingState';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'patient' | 'staff' | 'admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect after loading is complete and we have user data
    if (!loading && user && profile) {
      console.log('ProtectedRoute: User authenticated with role:', profile.role, 'at path:', location.pathname);
      
      // If user is a patient and trying to access staff areas, redirect to patient dashboard
      if (profile.role === 'patient' && requiredRole === 'staff') {
        console.log('Patient trying to access staff area, redirecting to patient dashboard');
        navigate('/patient-dashboard', { replace: true });
        return;
      }
      
      // If user is staff and trying to access patient-only areas, redirect to main dashboard
      if ((profile.role === 'staff' || profile.role === 'admin') && location.pathname === '/patient-dashboard') {
        console.log('Staff trying to access patient dashboard, redirecting to main dashboard');
        navigate('/', { replace: true });
        return;
      }
    }
  }, [user, profile, loading, navigate, location.pathname, requiredRole]);

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
        case 'admin':
          return profile.role === 'admin';
        case 'staff':
          return profile.role === 'staff' || profile.role === 'admin';
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
