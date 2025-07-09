
import React from 'react';
import { EnhancedProtectedRoute } from './EnhancedProtectedRoute';

interface TenantProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'patient' | 'staff' | 'practice_admin' | 'platform_admin';
}

export const TenantProtectedRoute: React.FC<TenantProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'staff' 
}) => {
  return (
    <EnhancedProtectedRoute requiredRole={requiredRole}>
      {children}
    </EnhancedProtectedRoute>
  );
};
