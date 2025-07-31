import React from 'react';
import { SpecialtyProvider } from '@/contexts/SpecialtyContext';
import { TenantProtectedRoute } from '@/components/auth/TenantProtectedRoute';

interface CommunicationIQWrapperProps {
  children: React.ReactNode;
  mode?: 'integrated' | 'standalone';
  tenantConfig?: {
    branding?: {
      primaryColor?: string;
      logo?: string;
      name?: string;
    };
  };
}

export const CommunicationIQWrapper: React.FC<CommunicationIQWrapperProps> = ({ 
  children, 
  mode = 'integrated',
  tenantConfig 
}) => {
  const isStandalone = mode === 'standalone';
  
  // Standalone mode has different auth requirements and styling
  if (isStandalone) {
    return (
      <div className="flowiq-connect-standalone">
        <style>{`
          .flowiq-connect-standalone {
            --primary: 142 76% 36%;
            --primary-foreground: 0 0% 98%;
            --secondary: 142 76% 46%;
            --secondary-foreground: 142 10% 10%;
            --accent: 142 76% 94%;
            --accent-foreground: 142 10% 10%;
            --muted: 142 30% 95%;
            --muted-foreground: 142 5% 45%;
            --border: 142 30% 82%;
            --card: 0 0% 100%;
            --card-foreground: 142 10% 10%;
            --brand-name: "${tenantConfig?.branding?.name || 'FlowIQ Connect'}";
            --specialty-features: "smart-communication, ai-scheduling, customer-support, multi-channel";
          }
          
          .flowiq-connect-standalone-header {
            background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)));
            color: hsl(var(--primary-foreground));
            padding: 1.5rem;
            text-align: center;
            border-radius: 0.5rem;
            margin-bottom: 2rem;
          }
          
          .flowiq-connect-standalone-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
          }
          
          .flowiq-connect-specialty-badge {
            background: hsl(var(--accent));
            color: hsl(var(--accent-foreground));
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 500;
          }
        `}</style>
        
        {/* Standalone header */}
        <div className="flowiq-connect-standalone-header">
          <h1 className="text-3xl font-bold mb-2">
            {tenantConfig?.branding?.name || 'FlowIQ Connect'}
          </h1>
          <p className="opacity-90 text-lg mb-3">AI-Powered Communication System for Service Businesses</p>
          <span className="flowiq-connect-specialty-badge">
            Smart Communication Platform
          </span>
        </div>
        
        <div className="flowiq-connect-standalone-content">
          {children}
        </div>
      </div>
    );
  }

  // Integrated mode uses tenant protection and specialty context
  return (
    <TenantProtectedRoute requiredRole="staff">
      <SpecialtyProvider>
        <div className="flowiq-connect-integrated">
          <style>{`
            .flowiq-connect-integrated {
              --primary: 142 76% 36%;
              --primary-foreground: 0 0% 98%;
              --secondary: 142 76% 46%;
              --secondary-foreground: 142 10% 10%;
              --accent: 142 76% 94%;
              --accent-foreground: 142 10% 10%;
              --muted: 142 30% 95%;
              --muted-foreground: 142 5% 45%;
              --border: 142 30% 82%;
              --card: 0 0% 100%;
              --card-foreground: 142 10% 10%;
              --brand-name: "FlowIQ Connect";
              --specialty-features: "smart-communication, ai-scheduling, customer-support, automation";
            }
            
            .flowiq-connect-integrated-header {
              background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)));
              color: hsl(var(--primary-foreground));
              padding: 1rem;
              border-radius: 0.5rem;
              margin-bottom: 1.5rem;
              text-align: center;
            }
            
            .flowiq-connect-specialty-badge {
              background: hsl(var(--accent));
              color: hsl(var(--accent-foreground));
              padding: 0.25rem 0.75rem;
              border-radius: 9999px;
              font-size: 0.875rem;
              font-weight: 500;
            }
          `}</style>
          
          <div className="flowiq-connect-integrated-header">
            <h2 className="text-xl font-semibold mb-2">FlowIQ Connect</h2>
            <p className="opacity-90 mb-2">AI-Powered Communication System</p>
            <div className="flex justify-center">
              <span className="flowiq-connect-specialty-badge">
                Smart Communication Platform
              </span>
            </div>
          </div>
          
          {children}
        </div>
      </SpecialtyProvider>
    </TenantProtectedRoute>
  );
};