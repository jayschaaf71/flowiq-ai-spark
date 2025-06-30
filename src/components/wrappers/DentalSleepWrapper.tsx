
import React from 'react';
import { SpecialtyProvider } from '@/contexts/SpecialtyContext';
import { TenantProtectedRoute } from '@/components/auth/TenantProtectedRoute';

interface DentalSleepWrapperProps {
  children: React.ReactNode;
}

export const DentalSleepWrapper: React.FC<DentalSleepWrapperProps> = ({ children }) => {
  return (
    <TenantProtectedRoute requiredRole="staff">
      <SpecialtyProvider>
        <div className="dental-sleep-theme">
          <style>{`
            .dental-sleep-theme {
              --primary-color: #8b5cf6;
              --secondary-color: #a78bfa;
              --accent-color: #ede9fe;
            }
          `}</style>
          {children}
        </div>
      </SpecialtyProvider>
    </TenantProtectedRoute>
  );
};
