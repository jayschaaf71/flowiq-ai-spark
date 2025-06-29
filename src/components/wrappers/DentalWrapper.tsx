
import React from 'react';
import { SpecialtyProvider } from '@/contexts/SpecialtyContext';
import { TenantProtectedRoute } from '@/components/auth/TenantProtectedRoute';

interface DentalWrapperProps {
  children: React.ReactNode;
}

export const DentalWrapper: React.FC<DentalWrapperProps> = ({ children }) => {
  return (
    <TenantProtectedRoute requiredRole="staff">
      <SpecialtyProvider>
        <div className="dental-theme">
          <style>{`
            .dental-theme {
              --primary-color: #3b82f6;
              --secondary-color: #60a5fa;
              --accent-color: #dbeafe;
            }
          `}</style>
          {children}
        </div>
      </SpecialtyProvider>
    </TenantProtectedRoute>
  );
};
