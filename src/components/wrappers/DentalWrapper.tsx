
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
              --primary-color: #22c55e;
              --secondary-color: #16a34a;
              --accent-color: #dcfce7;
            }
          `}</style>
          {children}
        </div>
      </SpecialtyProvider>
    </TenantProtectedRoute>
  );
};
