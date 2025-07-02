
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
        <div className="dental-iq-theme">
          <style>{`
            .dental-iq-theme {
              --primary: 198 89% 48%;
              --primary-foreground: 0 0% 98%;
              --secondary: 198 93% 60%;
              --secondary-foreground: 198 10% 10%;
              --accent: 198 100% 91%;
              --accent-foreground: 198 10% 10%;
              --muted: 198 30% 95%;
              --muted-foreground: 198 5% 45%;
              --border: 198 30% 82%;
              --card: 0 0% 100%;
              --card-foreground: 198 10% 10%;
              --brand-name: "DentalIQ";
              --specialty-features: "cleanings, fillings, crowns, oral-surgery";
            }
            
            .dental-iq-header {
              background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)));
              color: hsl(var(--primary-foreground));
              padding: 1rem;
              border-radius: 0.5rem;
              margin-bottom: 1.5rem;
            }
            
            .dental-specialty-badge {
              background: hsl(var(--accent));
              color: hsl(var(--accent-foreground));
              padding: 0.25rem 0.75rem;
              border-radius: 9999px;
              font-size: 0.875rem;
              font-weight: 500;
            }
          `}</style>
          
          {/* DentalIQ Header */}
          <div className="dental-iq-header">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">DentalIQ</h1>
                <p className="opacity-90 text-sm">Complete oral health management</p>
              </div>
              <span className="dental-specialty-badge">
                Dental Care
              </span>
            </div>
          </div>
          
          {children}
        </div>
      </SpecialtyProvider>
    </TenantProtectedRoute>
  );
};
