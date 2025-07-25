/**
 * Phase 4: Route Testing Framework
 * Comprehensive route validation and testing utilities
 */

export interface RouteTest {
  path: string;
  expectedTenant: string | null;
  expectedSpecialty: string | null;
  expectedApp: string;
  isProduction: boolean;
}

export interface RouteValidationResult {
  path: string;
  passed: boolean;
  expected: any;
  actual: any;
  message: string;
}

/**
 * Test matrix for all expected routes
 */
export const routeTestMatrix: RouteTest[] = [
  // Development routes
  {
    path: '/dental-sleep/dashboard',
    expectedTenant: 'd52278c3-bf0d-4731-bfa9-a40f032fa305',
    expectedSpecialty: 'dental-sleep-medicine',
    expectedApp: 'DentalSleepApp',
    isProduction: false
  },
  {
    path: '/chiropractic/dashboard',
    expectedTenant: '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
    expectedSpecialty: 'chiropractic-care',
    expectedApp: 'ChiropracticApp',
    isProduction: false
  },
  {
    path: '/dental-sleep/schedule',
    expectedTenant: 'd52278c3-bf0d-4731-bfa9-a40f032fa305',
    expectedSpecialty: 'dental-sleep-medicine',
    expectedApp: 'DentalSleepApp',
    isProduction: false
  },
  {
    path: '/chiropractic/analytics',
    expectedTenant: '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
    expectedSpecialty: 'chiropractic-care',
    expectedApp: 'ChiropracticApp',
    isProduction: false
  },
  // Root paths
  {
    path: '/',
    expectedTenant: null,
    expectedSpecialty: null,
    expectedApp: 'Index',
    isProduction: false
  }
];

/**
 * Validate a specific route configuration
 */
export function validateRoute(test: RouteTest): RouteValidationResult {
  // Simulate the route by temporarily updating the pathname
  const originalPathname = window.location.pathname;
  
  try {
    // Create a mock location for testing
    const mockLocation = {
      ...window.location,
      pathname: test.path
    };
    
    // Import parseTenantFromUrl dynamically to avoid circular imports
    const { parseTenantFromUrl } = require('@/utils/tenantRouting');
    
    // Temporarily override window.location.pathname
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true
    });
    
    const result = parseTenantFromUrl();
    
    const passed = 
      result?.tenantId === test.expectedTenant &&
      result?.specialty === test.expectedSpecialty &&
      result?.isProduction === test.isProduction;
    
    return {
      path: test.path,
      passed,
      expected: {
        tenantId: test.expectedTenant,
        specialty: test.expectedSpecialty,
        isProduction: test.isProduction,
        app: test.expectedApp
      },
      actual: result,
      message: passed ? '✅ Route validation passed' : '❌ Route validation failed'
    };
  } catch (error) {
    return {
      path: test.path,
      passed: false,
      expected: test,
      actual: null,
      message: `❌ Route validation error: ${error}`
    };
  } finally {
    // Restore original pathname
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        pathname: originalPathname
      },
      writable: true
    });
  }
}

/**
 * Run all route tests and return results
 */
export function runAllRouteTests(): RouteValidationResult[] {
  console.log('🧪 Running comprehensive route tests...');
  
  const results = routeTestMatrix.map(validateRoute);
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  console.log(`📊 Route Test Results: ${passed}/${total} passed`);
  
  results.forEach(result => {
    console.log(`${result.message} - ${result.path}`);
    if (!result.passed) {
      console.log('   Expected:', result.expected);
      console.log('   Actual:', result.actual);
    }
  });
  
  return results;
}

/**
 * Log current route detection state
 */
export function logCurrentRouteState(): void {
  const { parseTenantFromUrl } = require('@/utils/tenantRouting');
  const tenantRoute = parseTenantFromUrl();
  
  console.log('🔍 Current Route State:');
  console.log('   URL:', window.location.href);
  console.log('   Hostname:', window.location.hostname);
  console.log('   Pathname:', window.location.pathname);
  console.log('   Detected Tenant:', tenantRoute);
  console.log('   Production Mode:', tenantRoute?.isProduction);
  console.log('   Specialty:', tenantRoute?.specialty);
}