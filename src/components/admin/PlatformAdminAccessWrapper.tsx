import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield } from 'lucide-react';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { useNavigate } from 'react-router-dom';

interface PlatformAdminAccessWrapperProps {
  children: React.ReactNode;
}

export const PlatformAdminAccessWrapper: React.FC<PlatformAdminAccessWrapperProps> = ({ children }) => {
  const { canAccessPlatformAdmin, role, isLoading } = useRoleAccess();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!canAccessPlatformAdmin) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <Alert className="border-destructive bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="space-y-3">
            <div>
              <p className="font-semibold">Access Denied</p>
              <p>You do not have sufficient privileges to access this area.</p>
              <p>This incident has been logged for security purposes.</p>
            </div>
            <div className="text-sm space-y-1">
              <p><span className="font-medium">Required Role:</span> platform_admin</p>
              <p><span className="font-medium">Your Role:</span> {role || 'unknown'}</p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(-1)}
              >
                Go Back
              </Button>
            </div>
          </AlertDescription>
        </Alert>
        
        <div className="mt-6 p-6 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">About Platform Administration</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Platform Administration is restricted to FlowIQ personnel who manage the overall application 
            infrastructure, monitor system performance across all tenants, and handle enterprise-level 
            configurations. If you believe you should have access, please contact your system administrator.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};