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

  // Always wrap with SpecialtyProvider to avoid context errors
  const wrappedChildren = (
    <SpecialtyProvider>
      {children}
    </SpecialtyProvider>
  );

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
          
          .flowiq-connect-standalone-content {
            width: 100%;
            max-width: 100%;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }
        `}</style>

        <div className="flowiq-connect-standalone-content">
          {wrappedChildren}
        </div>
      </div>
    );
  }

  // Integrated mode uses tenant protection and specialty context
  return (
    <TenantProtectedRoute requiredRole="staff">
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
        `}</style>

        {wrappedChildren}
      </div>
    </TenantProtectedRoute>
  );
};