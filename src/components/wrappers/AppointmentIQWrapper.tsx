import React from 'react';
import { SpecialtyProvider } from '@/contexts/SpecialtyContext';
import { TenantProtectedRoute } from '@/components/auth/TenantProtectedRoute';

interface AppointmentIQWrapperProps {
  children: React.ReactNode;
  mode?: 'integrated' | 'standalone';
  tenantConfig?: {
    branding?: {
      primaryColor?: string;
      logo?: string;
      name?: string;
    };
    features?: {
      voiceBooking?: boolean;
      aiConflictResolution?: boolean;
      multiProvider?: boolean;
      waitlistManagement?: boolean;
    };
    integrations?: {
      calendar?: 'google' | 'outlook' | 'apple';
      ehr?: string;
      sms?: boolean;
      email?: boolean;
    };
  };
}

export const AppointmentIQWrapper: React.FC<AppointmentIQWrapperProps> = ({ 
  children, 
  mode = 'integrated',
  tenantConfig 
}) => {
  const isStandalone = mode === 'standalone';
  
  // Standalone mode has different auth requirements and styling
  if (isStandalone) {
    return (
      <div className="appointmentiq-standalone">
        <style>{`
          .appointmentiq-standalone {
            --primary-color: ${tenantConfig?.branding?.primaryColor || '#3b82f6'};
            --secondary-color: #60a5fa;
            --accent-color: #dbeafe;
            --brand-name: "${tenantConfig?.branding?.name || 'AppointmentIQ'}";
          }
          
          .standalone-header {
            background: var(--primary-color);
            color: white;
            padding: 1rem;
            text-align: center;
          }
          
          .standalone-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
          }
        `}</style>
        
        {/* Standalone header */}
        <div className="standalone-header">
          <h1 className="text-2xl font-bold">
            {tenantConfig?.branding?.name || 'AppointmentIQ'}
          </h1>
          <p className="opacity-90">AI-Powered Appointment Scheduling</p>
        </div>
        
        <div className="standalone-content">
          {children}
        </div>
      </div>
    );
  }

  // Integrated mode uses tenant protection and specialty context
  return (
    <TenantProtectedRoute requiredRole="staff">
      <SpecialtyProvider>
        <div className="appointmentiq-integrated">
          <style>{`
            .appointmentiq-integrated {
              --appointmentiq-primary: #3b82f6;
              --appointmentiq-secondary: #60a5fa;
              --appointmentiq-accent: #dbeafe;
            }
          `}</style>
          {children}
        </div>
      </SpecialtyProvider>
    </TenantProtectedRoute>
  );
};