
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
        <div className="chiropractic-iq-theme">
          <style>{`
            .chiropractic-iq-theme {
              --primary: 142 60% 42%;
              --primary-foreground: 0 0% 98%;
              --secondary: 142 52% 54%;
              --secondary-foreground: 142 10% 10%;
              --accent: 142 76% 91%;
              --accent-foreground: 142 10% 10%;
              --muted: 142 30% 95%;
              --muted-foreground: 142 5% 45%;
              --border: 142 30% 82%;
              --card: 0 0% 100%;
              --card-foreground: 142 10% 10%;
              --brand-name: "ChiropracticIQ";
              --specialty-features: "spinal-adjustments, physical-therapy, pain-management";
            }
            
            .chiropractic-iq-header {
              background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)));
              color: hsl(var(--primary-foreground));
              padding: 1rem;
              border-radius: 0.5rem;
              margin-bottom: 1.5rem;
            }
            
            .chiropractic-specialty-badge {
              background: hsl(var(--accent));
              color: hsl(var(--accent-foreground));
              padding: 0.25rem 0.75rem;
              border-radius: 9999px;
              font-size: 0.875rem;
              font-weight: 500;
            }
          `}</style>
          
          {/* ChiropracticIQ Header */}
          <div className="chiropractic-iq-header">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">ChiropracticIQ</h1>
                <p className="opacity-90 text-sm">Optimizing spinal health and mobility</p>
              </div>
              <span className="chiropractic-specialty-badge">
                Chiropractic Care
              </span>
            </div>
          </div>
          
          {children}
        </div>
      </SpecialtyProvider>
    </TenantProtectedRoute>
  );
};
