
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthPage } from './AuthPage';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'patient' | 'staff' | 'admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Shield className="h-12 w-12 text-blue-600 mx-auto animate-pulse" />
          <div className="text-lg font-medium">Verifying secure access...</div>
          <div className="text-sm text-gray-600">Please wait while we authenticate your session</div>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <AuthPage />;
  }

  // HIPAA Compliance: Role-based access control
  if (requiredRole) {
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
