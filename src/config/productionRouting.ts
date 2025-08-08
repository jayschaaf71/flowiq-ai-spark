// Production domain routing configuration
export const PRODUCTION_DOMAINS = {
  // Main FlowIQ domain
  'flow-iq.ai': {
    defaultApp: 'chiropractic',
    apps: {
      chiropractic: '/chiropractic',
      dentalSleep: '/dental-sleep'
    }
  },
  
  // Midwest Dental Sleep Medicine
  'midwest-dental-sleep.flow-iq.ai': {
    defaultApp: 'dentalSleep',
    specialty: 'dental-sleep-medicine',
    brandName: 'Midwest Dental Sleep Medicine',
    apps: {
      dentalSleep: '/'
    }
  },
  
  // West County Spine & Joint
  'west-county-spine.flow-iq.ai': {
    defaultApp: 'chiropractic',
    specialty: 'chiropractic-care',
    brandName: 'West County Spine & Joint',
    apps: {
      chiropractic: '/'
    }
  }
};

export const getDomainConfig = (hostname: string) => {
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

export const isProductionDomain = (hostname: string): boolean => {
  const cleanHostname = hostname.split(':')[0];
  return Object.keys(PRODUCTION_DOMAINS).some(domain => 
    cleanHostname === domain || cleanHostname.includes(domain.split('.')[0])
  );
}; 