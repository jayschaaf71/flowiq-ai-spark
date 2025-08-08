/**
 * Production tenant routing utilities
 * Handles subdomain-based tenant detection and routing
 */

export interface TenantRoute {
  tenantId: string;
  subdomain: string;
  specialty: string;
  isProduction: boolean;
}

/**
 * Parse the current URL to determine tenant information
 * Phase 1: Simplified route detection with clear production vs development logic
 */
export function parseTenantFromUrl(): TenantRoute | null {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;

  console.log('🔍 Route Detection - hostname:', hostname, 'pathname:', pathname);

  // Clear production domain detection
  const isProductionDomain = (
    hostname.includes('flow-iq.ai') ||
    hostname.includes('flowiq.com') ||
    hostname.includes('vercel.app')
  ) && !hostname.includes('lovableproject.com') && !hostname.includes('lovable.app');

  console.log('🏭 Production domain check:', isProductionDomain);

  // Production subdomain routing
  if (isProductionDomain) {
    const subdomain = hostname.split('.')[0];
    console.log('🏢 Production subdomain:', subdomain);

    const tenantMap: Record<string, Omit<TenantRoute, 'isProduction'>> = {
      'midwest-dental-sleep': {
        tenantId: 'd52278c3-bf0d-4731-bfa9-a40f032fa305',
        subdomain: 'midwest-dental-sleep',
        specialty: 'dental-sleep-medicine'
      },
      'west-county-spine': {
        tenantId: '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
        subdomain: 'west-county-spine',
        specialty: 'chiropractic-care'
      },
      'general-dentistry': {
        tenantId: '00000000-0000-0000-0000-000000000003',
        subdomain: 'general-dentistry',
        specialty: 'general-dentistry'
      },
      'connect': {
        tenantId: '00000000-0000-0000-0000-000000000001',
        subdomain: 'connect',
        specialty: 'communication'
      }
    };

    if (tenantMap[subdomain]) {
      console.log('✅ Production tenant found:', tenantMap[subdomain]);
      return {
        ...tenantMap[subdomain],
        isProduction: true
      };
    }
  }

  // Development and Production path-based routing - clean detection
  const pathTenantMap: Record<string, Omit<TenantRoute, 'isProduction'>> = {
    '/dental-sleep': {
      tenantId: 'd52278c3-bf0d-4731-bfa9-a40f032fa305',
      subdomain: 'midwest-dental-sleep',
      specialty: 'dental-sleep-medicine'
    },
    '/dental-sleep-medicine': {
      tenantId: 'd52278c3-bf0d-4731-bfa9-a40f032fa305',
      subdomain: 'midwest-dental-sleep',
      specialty: 'dental-sleep-medicine'
    },
    '/general-dentistry': {
      tenantId: '00000000-0000-0000-0000-000000000003',
      subdomain: 'general-dentistry',
      specialty: 'general-dentistry'
    },
    '/chiropractic': {
      tenantId: '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
      subdomain: 'west-county-spine',
      specialty: 'chiropractic-care'
    },
    '/chiropractic-care': {
      tenantId: '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
      subdomain: 'west-county-spine',
      specialty: 'chiropractic-care'
    }
  };

  for (const [pathPrefix, tenantConfig] of Object.entries(pathTenantMap)) {
    if (pathname.startsWith(pathPrefix)) {
      console.log('✅ Path-based tenant found for path:', pathPrefix, tenantConfig);
      return {
        ...tenantConfig,
        isProduction: isProductionDomain
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
  const isProduction = window.location.hostname.includes('flowiq.com') ||
    window.location.hostname.includes('flow-iq.ai') ||
    window.location.hostname.includes('vercel.app');

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
    'west-county-spine': 'chiropractic-care'
  };

  return subdomainMap[subdomain] || 'chiropractic-care';
}