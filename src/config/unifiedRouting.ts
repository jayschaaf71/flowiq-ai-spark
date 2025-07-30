/**
 * Unified Routing System
 * Consolidates production and development routing into a single system
 */

export interface TenantRoute {
  tenantId: string;
  subdomain: string;
  specialty: string;
  brandName: string;
  isProduction: boolean;
  defaultApp: string;
}

export interface DomainConfig {
  defaultApp: string;
  specialty: string;
  brandName: string;
  tenantId: string;
  subdomain: string;
  apps: Record<string, string>;
}

// Production domain configuration
export const PRODUCTION_DOMAINS: Record<string, DomainConfig> = {
  // Main FlowIQ domain
  'flow-iq.ai': {
    defaultApp: 'marketing',
    specialty: 'general',
    brandName: 'FlowIQ',
    tenantId: '00000000-0000-0000-0000-000000000000',
    subdomain: 'main',
    apps: {
      marketing: '/',
      chiropractic: '/chiropractic',
      dentalSleep: '/dental-sleep',
      communication: '/communication'
    }
  },
  
  // Midwest Dental Sleep Medicine
  'midwest-dental-sleep.flow-iq.ai': {
    defaultApp: 'dentalSleep',
    specialty: 'dental-sleep-medicine',
    brandName: 'Midwest Dental Sleep Medicine',
    tenantId: 'd52278c3-bf0d-4731-bfa9-a40f032fa305',
    subdomain: 'midwest-dental-sleep',
    apps: {
      dentalSleep: '/'
    }
  },
  
  // West County Spine & Joint
  'west-county-spine.flow-iq.ai': {
    defaultApp: 'chiropractic',
    specialty: 'chiropractic-care',
    brandName: 'West County Spine & Joint',
    tenantId: '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
    subdomain: 'west-county-spine',
    apps: {
      chiropractic: '/'
    }
  }
};

// Development path-based routing
export const DEVELOPMENT_ROUTES: Record<string, DomainConfig> = {
  '/dental-sleep': {
    defaultApp: 'dentalSleep',
    specialty: 'dental-sleep-medicine',
    brandName: 'Midwest Dental Sleep Medicine',
    tenantId: 'd52278c3-bf0d-4731-bfa9-a40f032fa305',
    subdomain: 'midwest-dental-sleep',
    apps: {
      dentalSleep: '/dental-sleep'
    }
  },
  '/dental-sleep-medicine': {
    defaultApp: 'dentalSleep',
    specialty: 'dental-sleep-medicine',
    brandName: 'Midwest Dental Sleep Medicine',
    tenantId: 'd52278c3-bf0d-4731-bfa9-a40f032fa305',
    subdomain: 'midwest-dental-sleep',
    apps: {
      dentalSleep: '/dental-sleep-medicine'
    }
  },
  '/chiropractic': {
    defaultApp: 'chiropractic',
    specialty: 'chiropractic-care',
    brandName: 'West County Spine & Joint',
    tenantId: '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
    subdomain: 'west-county-spine',
    apps: {
      chiropractic: '/chiropractic'
    }
  },
  '/chiropractic-care': {
    defaultApp: 'chiropractic',
    specialty: 'chiropractic-care',
    brandName: 'West County Spine & Joint',
    tenantId: '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
    subdomain: 'west-county-spine',
    apps: {
      chiropractic: '/chiropractic-care'
    }
  },
  '/communication': {
    defaultApp: 'communication',
    specialty: 'communication',
    brandName: 'FlowIQ Connect',
    tenantId: '00000000-0000-0000-0000-000000000001',
    subdomain: 'communication',
    apps: {
      communication: '/communication'
    }
  }
};

/**
 * Get domain configuration based on hostname
 */
export const getDomainConfig = (hostname: string): DomainConfig => {
  // Remove port if present
  const cleanHostname = hostname.split(':')[0];
  
  // Check for exact domain match
  if (PRODUCTION_DOMAINS[cleanHostname]) {
    return PRODUCTION_DOMAINS[cleanHostname];
  }
  
  // Check for subdomain patterns
  if (cleanHostname.includes('midwest-dental-sleep')) {
    return PRODUCTION_DOMAINS['midwest-dental-sleep.flow-iq.ai'];
  }
  
  if (cleanHostname.includes('west-county-spine')) {
    return PRODUCTION_DOMAINS['west-county-spine.flow-iq.ai'];
  }
  
  // Default to main domain
  return PRODUCTION_DOMAINS['flow-iq.ai'];
};

/**
 * Check if current domain is production
 */
export const isProductionDomain = (hostname: string): boolean => {
  const cleanHostname = hostname.split(':')[0];
  return Object.keys(PRODUCTION_DOMAINS).some(domain => 
    cleanHostname === domain || cleanHostname.includes(domain.split('.')[0])
  );
};

/**
 * Parse tenant from URL (unified method)
 */
export function parseTenantFromUrl(): TenantRoute | null {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  console.log('🔍 Unified Route Detection - hostname:', hostname, 'pathname:', pathname);
  
  const isProduction = isProductionDomain(hostname);
  console.log('🏭 Production domain check:', isProduction);
  
  // Production subdomain routing
  if (isProduction) {
    const subdomain = hostname.split('.')[0];
    console.log('🏢 Production subdomain:', subdomain);
    
    const domainConfig = getDomainConfig(hostname);
    if (domainConfig) {
      console.log('✅ Production tenant found:', domainConfig);
      return {
        tenantId: domainConfig.tenantId,
        subdomain: domainConfig.subdomain,
        specialty: domainConfig.specialty,
        brandName: domainConfig.brandName,
        isProduction: true,
        defaultApp: domainConfig.defaultApp
      };
    }
  }
  
  // Development path-based routing
  for (const [pathPrefix, config] of Object.entries(DEVELOPMENT_ROUTES)) {
    if (pathname.startsWith(pathPrefix)) {
      console.log('✅ Development tenant found for path:', pathPrefix, config);
      return {
        tenantId: config.tenantId,
        subdomain: config.subdomain,
        specialty: config.specialty,
        brandName: config.brandName,
        isProduction: false,
        defaultApp: config.defaultApp
      };
    }
  }
  
  console.log('❌ No tenant detected for this route');
  return null;
}

/**
 * Get the appropriate app route based on tenant specialty
 */
export function getSpecialtyRoute(specialty: string, route: string = ''): string {
  const specialtyRoutes: Record<string, string> = {
    'dental-sleep-medicine': '/dental-sleep',
    'chiropractic-care': '/chiropractic',
    'communication': '/communication',
    'general-dentistry': '/general-dentistry',
    'orthodontics': '/orthodontics',
    'veterinary': '/veterinary',
    'concierge-medicine': '/concierge-medicine',
    'hrt': '/hrt',
    'medspa': '/medspa',
    'physical-therapy': '/physical-therapy',
    'mental-health': '/mental-health',
    'dermatology': '/dermatology',
    'urgent-care': '/urgent-care'
  };
  
  const baseRoute = specialtyRoutes[specialty] || '/chiropractic';
  return route ? `${baseRoute}/${route}` : baseRoute;
}

/**
 * Redirect user to appropriate tenant dashboard
 */
export function redirectToTenantDashboard(tenantRoute: TenantRoute) {
  const dashboardRoute = getSpecialtyRoute(tenantRoute.specialty, 'dashboard');
  window.location.href = dashboardRoute;
}

/**
 * Get the tenant URL for a given subdomain
 */
export function getTenantUrl(subdomain: string, path: string = ''): string {
  const isProduction = isProductionDomain(window.location.hostname);
  
  if (isProduction) {
    const domain = window.location.hostname.includes('flowiq.com') ? 'flowiq.com' : 'flow-iq.ai';
    return `https://${subdomain}.${domain}${path}`;
  } else {
    // Development - use path-based routing
    return `${window.location.origin}${getSpecialtyRoute(getSpecialtyFromSubdomain(subdomain))}${path}`;
  }
}

/**
 * Map subdomain to specialty
 */
function getSpecialtyFromSubdomain(subdomain: string): string {
  const subdomainMap: Record<string, string> = {
    'midwest-dental-sleep': 'dental-sleep-medicine',
    'west-county-spine': 'chiropractic-care',
    'communication': 'communication'
  };
  
  return subdomainMap[subdomain] || 'chiropractic-care';
} 