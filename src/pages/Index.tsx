
import React from 'react';
import { TenantLandingPage } from '@/components/landing/TenantLandingPage';
import { getPracticeConfig } from '@/utils/practiceConfig';

const Index = () => {
  const detectTenant = () => {
    // Check URL parameters first (for testing)
    const urlParams = new URLSearchParams(window.location.search);
    const tenantParam = urlParams.get('tenant');
    if (tenantParam) {
      console.log('Index: Using tenant from URL parameter:', tenantParam);
      return tenantParam;
    }

    // Production subdomain detection
    const hostname = window.location.hostname;
    console.log('Index: Detecting tenant from hostname:', hostname);
    
    if (hostname === 'localhost' || hostname.includes('127.0.0.1') || hostname.includes('lovable.app')) {
      // Development mode - default to west-county-spine for testing
      console.log('Index: Development mode detected, using west-county-spine');
      return 'west-county-spine';
    }
    
    // Extract subdomain from production domains
    if (hostname.includes('flow-iq.ai') || hostname.includes('flowiq.com')) {
      const parts = hostname.split('.');
      console.log('Index: Hostname parts:', parts);
      
      if (parts.length >= 3) {
        const subdomain = parts[0];
        console.log('Index: Extracted subdomain:', subdomain);
        
        // Verify it's a known tenant
        const config = getPracticeConfig(subdomain);
        if (config) {
          console.log('Index: Found valid config for subdomain:', subdomain);
          return subdomain;
        } else {
          console.log('Index: No config found for subdomain:', subdomain);
        }
      }
    }
    
    // Default fallback
    console.log('Index: Using default fallback: west-county-spine');
    return 'west-county-spine';
  };

  const currentTenant = detectTenant();
  console.log('Index: Detected tenant:', currentTenant, 'from hostname:', window.location.hostname);

  return <TenantLandingPage tenantSubdomain={currentTenant} />;
};

export default Index;
