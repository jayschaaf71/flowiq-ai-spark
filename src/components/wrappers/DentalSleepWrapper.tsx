
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
        <div className="dental-sleep-iq-theme">
          <style>{`
            .dental-sleep-iq-theme {
              --primary: 258 92% 66%;
              --primary-foreground: 0 0% 98%;
              --secondary: 258 90% 76%;
              --secondary-foreground: 258 10% 10%;
              --accent: 258 100% 94%;
              --accent-foreground: 258 10% 10%;
              --muted: 258 30% 95%;
              --muted-foreground: 258 5% 45%;
              --border: 258 30% 82%;
              --card: 0 0% 100%;
              --card-foreground: 258 10% 10%;
              --brand-name: "DentalSleepIQ";
              --specialty-features: "sleep-studies, oral-appliances, titration, follow-up";
            }
            
            .dental-sleep-iq-header {
              background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)));
              color: hsl(var(--primary-foreground));
              padding: 1rem;
              border-radius: 0.5rem;
              margin-bottom: 1.5rem;
            }
            
            .dental-sleep-specialty-badge {
              background: hsl(var(--accent));
              color: hsl(var(--accent-foreground));
              padding: 0.25rem 0.75rem;
              border-radius: 9999px;
              font-size: 0.875rem;
              font-weight: 500;
            }
          `}</style>
          
          {children}
        </div>
      </SpecialtyProvider>
    </TenantProtectedRoute>
  );
};
