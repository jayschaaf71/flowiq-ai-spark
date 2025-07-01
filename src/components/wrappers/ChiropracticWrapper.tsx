
import React from 'react';
import { SpecialtyProvider } from '@/contexts/SpecialtyContext';
import { TenantProtectedRoute } from '@/components/auth/TenantProtectedRoute';

interface ChiropracticWrapperProps {
  children: React.ReactNode;
}

export const ChiropracticWrapper: React.FC<ChiropracticWrapperProps> = ({ children }) => {
  return (
    <TenantProtectedRoute requiredRole="staff">
      <SpecialtyProvider>
        <div className="chiropractic-theme">
          <style>{`
            .chiropractic-theme {
              --primary-color: #16a34a;
              --secondary-color: #22c55e;
              --accent-color: #dcfce7;
            }
          `}</style>
          {children}
        </div>
      </SpecialtyProvider>
    </TenantProtectedRoute>
  );
};
