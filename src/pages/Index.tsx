
import React from 'react';
import { TenantLandingPage } from '@/components/landing/TenantLandingPage';
import { getPracticeConfig } from '@/utils/practiceConfig';

const Index = () => {
  const detectTenant = () => {
    // Check URL parameters first (for testing)
    const urlParams = new URLSearchParams(window.location.search);
    const tenantParam = urlParams.get('tenant');
    if (tenantParam) {
      return tenantParam;
    }

    // Production subdomain detection
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname.includes('127.0.0.1')) {
      // Development mode - default to west-county-spine for testing
      return 'west-county-spine';
    }
    
    // Extract subdomain from production domains
    if (hostname.includes('flow-iq.ai') || hostname.includes('flowiq.com')) {
      const parts = hostname.split('.');
      if (parts.length >= 3) {
        const subdomain = parts[0];
        // Verify it's a known tenant
        const config = getPracticeConfig(subdomain);
        if (config) {
          return subdomain;
        }
      }
    }
    
    // Default fallback
    return 'west-county-spine';
  };

  const currentTenant = detectTenant();
  console.log('Index: Detected tenant:', currentTenant, 'from hostname:', window.location.hostname);

  return <TenantLandingPage tenantSubdomain={currentTenant} />;
};

export default Index;
