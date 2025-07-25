/**
 * Phase 5: Route Testing and Validation Runner
 * Execute this to validate all routes are working correctly
 */

import { runAllRouteTests, logCurrentRouteState } from './routeValidator';

/**
 * Development route test - run this in browser console
 */
export function testAllRoutes() {
  console.log('🚀 Starting comprehensive route testing...');
  
  // Log current state
  logCurrentRouteState();
  
  // Run all tests
  const results = runAllRouteTests();
  
  // Summary
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  console.log(`\n📊 FINAL RESULTS:`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);
  
  if (failed > 0) {
    console.log(`\n🔧 Failed Routes:`);
    results.filter(r => !r.passed).forEach(result => {
      console.log(`   ${result.path}: ${result.message}`);
    });
  }
  
  return results;
}

/**
 * Test current route specifically
 */
export function testCurrentRoute() {
  console.log('🎯 Testing current route...');
  logCurrentRouteState();
}

// Make functions available globally for console testing
if (typeof window !== 'undefined') {
  (window as any).testAllRoutes = testAllRoutes;
  (window as any).testCurrentRoute = testCurrentRoute;
  console.log('🧪 Route testing functions available:');
  console.log('   - testAllRoutes(): Run comprehensive route tests');
  console.log('   - testCurrentRoute(): Test current route only');
}