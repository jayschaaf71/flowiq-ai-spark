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
            --primary: 214 100% 59%;
            --primary-foreground: 0 0% 98%;
            --secondary: 214 95% 69%;
            --secondary-foreground: 214 10% 10%;
            --accent: 214 100% 91%;
            --accent-foreground: 214 10% 10%;
            --muted: 214 30% 95%;
            --muted-foreground: 214 5% 45%;
            --border: 214 30% 82%;
            --card: 0 0% 100%;
            --card-foreground: 214 10% 10%;
            --brand-name: "${tenantConfig?.branding?.name || 'AppointmentIQ'}";
            --specialty-features: "voice-booking, ai-scheduling, conflict-resolution, waitlist";
          }
          
          .appointmentiq-standalone-header {
            background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)));
            color: hsl(var(--primary-foreground));
            padding: 1.5rem;
            text-align: center;
            border-radius: 0.5rem;
            margin-bottom: 2rem;
          }
          
          .appointmentiq-standalone-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
          }
          
          .appointmentiq-specialty-badge {
            background: hsl(var(--accent));
            color: hsl(var(--accent-foreground));
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 500;
            margin-top: 0.5rem;
            display: inline-block;
          }
        `}</style>
        
        {/* Standalone header */}
        <div className="appointmentiq-standalone-header">
          <h1 className="text-3xl font-bold mb-2">
            {tenantConfig?.branding?.name || 'AppointmentIQ'}
          </h1>
          <p className="opacity-90 text-lg mb-3">AI-Powered Appointment Scheduling</p>
          <span className="appointmentiq-specialty-badge">
            Smart Scheduling Platform
          </span>
        </div>
        
        <div className="appointmentiq-standalone-content">
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
              --primary: 214 100% 59%;
              --primary-foreground: 0 0% 98%;
              --secondary: 214 95% 69%;
              --secondary-foreground: 214 10% 10%;
              --accent: 214 100% 91%;
              --accent-foreground: 214 10% 10%;
              --brand-name: "AppointmentIQ";
              --specialty-features: "voice-booking, ai-scheduling, conflict-resolution";
            }
            
            .appointmentiq-integrated-header {
              background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)));
              color: hsl(var(--primary-foreground));
              padding: 1rem;
              border-radius: 0.5rem;
              margin-bottom: 1.5rem;
            }
            
            .appointmentiq-integrated-badge {
              background: hsl(var(--accent));
              color: hsl(var(--accent-foreground));
              padding: 0.25rem 0.75rem;
              border-radius: 9999px;
              font-size: 0.875rem;
              font-weight: 500;
            }
          `}</style>
          
          {/* AppointmentIQ Header */}
          <div className="appointmentiq-integrated-header">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">AppointmentIQ</h1>
                <p className="opacity-90 text-sm">AI-powered scheduling and booking</p>
              </div>
              <span className="appointmentiq-integrated-badge">
                Smart Scheduling
              </span>
            </div>
          </div>
          
          {children}
        </div>
      </SpecialtyProvider>
    </TenantProtectedRoute>
  );
};