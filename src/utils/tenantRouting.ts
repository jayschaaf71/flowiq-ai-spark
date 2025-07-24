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
 */
export function parseTenantFromUrl(): TenantRoute | null {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  // Production subdomain routing (e.g., midwest-dental-sleep.flow-iq.ai)
  if (hostname !== 'localhost' && !hostname.includes('lovableproject.com') && 
      (hostname.includes('flow-iq.ai') || hostname.includes('flowiq.com'))) {
    const subdomain = hostname.split('.')[0];
    
    console.log('Production subdomain detected:', subdomain, 'from hostname:', hostname);
    
    // Map known subdomains to tenant info
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
      }
    };
    
    if (tenantMap[subdomain]) {
      console.log('Found tenant mapping for subdomain:', subdomain, tenantMap[subdomain]);
      return {
        ...tenantMap[subdomain],
        isProduction: true
      };
    } else {
      console.log('No tenant mapping found for subdomain:', subdomain);
    }
  }
  
  // Development path-based routing (e.g., /dental-sleep/*, /chiropractic/*)
  if (pathname.startsWith('/dental-sleep')) {
    return {
      tenantId: 'd52278c3-bf0d-4731-bfa9-a40f032fa305',
      subdomain: 'midwest-dental-sleep',
      specialty: 'dental-sleep-medicine',
      isProduction: false
    };
  }
  
  if (pathname.startsWith('/chiropractic')) {
    return {
      tenantId: '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
      subdomain: 'west-county-spine',
      specialty: 'chiropractic-care',
      isProduction: false
    };
  }
  
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
  const isProduction = window.location.hostname.includes('flowiq.com') || window.location.hostname.includes('flow-iq.ai');
  
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