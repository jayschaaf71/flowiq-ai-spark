
console.log('🚀 [DIAGNOSTIC] App.tsx - Starting imports');

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { SidebarProvider } from './components/ui/sidebar';
import { AuthProvider } from './contexts/AuthProvider';
import { SpecialtyProvider } from './contexts/SpecialtyContext';
import { ApplicationProvider } from './contexts/ApplicationContext';
import { SageAIProvider } from './contexts/SageAIContext';
import { ChiropracticApp } from './apps/ChiropracticApp';
import { DentalSleepApp } from './apps/DentalSleepApp';
import FlowIQConnectApp from './apps/CommunicationIQApp';
import { HealthCheck } from './components/health/HealthCheck';
import { MarketingHomepage } from './pages/MarketingHomepage';
import { HealthcareLanding } from './pages/HealthcareLanding';
import { ConnectLanding } from './pages/ConnectLanding';
import { OnboardingFlow } from './pages/OnboardingFlow';
import { SignupPage } from './pages/SignupPage';
import PlatformAdmin from './pages/PlatformAdmin';
import { OAuthCallback } from './pages/OAuthCallback';
import { getDomainConfig, isProductionDomain, parseTenantFromUrl } from './config/unifiedRouting';
import GeneralDentistryApp from './apps/GeneralDentistryApp';

// Create QueryClient instance
const queryClient = new QueryClient();

function App() {
  console.log('🚀 App: Rendering main App component');

  // Get domain configuration using unified routing
  const hostname = window.location.hostname;
  const domainConfig = getDomainConfig(hostname);
  const isProduction = isProductionDomain(hostname);
  const tenantRoute = parseTenantFromUrl();

  console.log('🌐 Unified routing config:', {
    hostname,
    domainConfig,
    isProduction,
    tenantRoute
  });

  // Determine if this is the main marketing website
  const isMarketingWebsite = hostname === 'flow-iq.ai' || hostname === 'localhost';

  // Determine if this is the admin domain
  const isAdminDomain = hostname === 'app.flow-iq.ai';

  // Determine if this is the connect subdomain
  const isConnectSubdomain = hostname === 'connect.flow-iq.ai';

  // Check if this is a production tenant subdomain
  const isProductionTenant = isProduction && domainConfig && domainConfig.subdomain !== 'main' && domainConfig.subdomain !== 'app';

  console.log('🔍 Domain detection:', {
    hostname,
    isMarketingWebsite,
    isAdminDomain,
    isConnectSubdomain,
    isProductionTenant,
    domainConfig,
    pathname: window.location.pathname
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SidebarProvider>
          <AuthProvider>
            <SpecialtyProvider>
              <ApplicationProvider>
                <SageAIProvider>
                  <Router>
                    <div className="app-debug-info" style={{ display: 'none' }}>
                      <p>Hostname: {hostname}</p>
                      <p>Is Marketing: {isMarketingWebsite.toString()}</p>
                      <p>Is Admin: {isAdminDomain.toString()}</p>
                      <p>Is Connect: {isConnectSubdomain.toString()}</p>
                      <p>Is Production Tenant: {isProductionTenant.toString()}</p>
                      <p>Domain Config: {JSON.stringify(domainConfig)}</p>
                    </div>
                    <Routes>
                      {/* Health check endpoint */}
                      <Route path="/health" element={<HealthCheck />} />

                      {/* Admin Platform Routes */}
                      {isAdminDomain && (
                        <Route path="/platform-admin/*" element={<PlatformAdmin />} />
                      )}

                      {/* Marketing Website Routes (main domain) */}
                      {isMarketingWebsite && (
                        <>
                          <Route path="/" element={<MarketingHomepage />} />
                          <Route path="/healthcare" element={<HealthcareLanding />} />
                          <Route path="/connect" element={<ConnectLanding />} />
                          <Route path="/onboarding" element={<OnboardingFlow />} />
                          <Route path="/signup" element={<SignupPage />} />
                          <Route path="/login" element={<Navigate to="/chiropractic/login" replace />} />
                        </>
                      )}

                      {/* Connect Subdomain Routes */}
                      {isConnectSubdomain && (
                        <>
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />
                          <Route path="/onboarding" element={<OnboardingFlow />} />
                          <Route path="/dashboard" element={<FlowIQConnectApp />} />
                          <Route path="/communication/*" element={<FlowIQConnectApp />} />
                          <Route path="/*" element={<FlowIQConnectApp />} />
                          <Route path="/test" element={
                            <div className="p-8 text-center">
                              <h1 className="text-2xl font-bold text-green-600 mb-4">✅ Connect Subdomain Working!</h1>
                              <p className="text-gray-600 mb-4">Hostname: {hostname}</p>
                              <p className="text-gray-600 mb-4">Pathname: {window.location.pathname}</p>
                              <a href="/dashboard" className="text-blue-600 hover:underline">Go to Dashboard</a>
                            </div>
                          } />
                        </>
                      )}

                      {/* Production Tenant Subdomain Routes */}
                      {isProductionTenant && (
                        <>
                          {/* Chiropractic App for West County Spine */}
                          {domainConfig?.specialty === 'chiropractic-care' && (
                            <>
                              <Route path="/" element={<ChiropracticApp />} />
                              <Route path="/*" element={<ChiropracticApp />} />
                            </>
                          )}

                          {/* Dental Sleep App for Midwest Dental */}
                          {domainConfig?.specialty === 'dental-sleep-medicine' && (
                            <>
                              <Route path="/" element={<DentalSleepApp />} />
                              <Route path="/*" element={<DentalSleepApp />} />
                            </>
                          )}

                          {/* General Dentistry App */}
                          {domainConfig?.specialty === 'general-dentistry' && (
                            <>
                              <Route path="/" element={<GeneralDentistryApp />} />
                              <Route path="/*" element={<GeneralDentistryApp />} />
                            </>
                          )}

                          {/* OAuth Callback */}
                          <Route path="/oauth-callback" element={<OAuthCallback />} />
                        </>
                      )}

                      {/* Healthcare Application Routes (Development) */}
                      {!isMarketingWebsite && !isAdminDomain && !isConnectSubdomain && !isProductionTenant && (
                        <>
                          {/* Chiropractic App */}
                          <Route path="/chiropractic/*" element={<ChiropracticApp />} />

                          {/* Dental Sleep App */}
                          <Route path="/dental-sleep/*" element={<DentalSleepApp />} />

                          {/* General Dentistry App */}
                          <Route path="/general-dentistry/*" element={<GeneralDentistryApp />} />

                          {/* Default redirect for healthcare domain */}
                          <Route path="/" element={<Navigate to="/chiropractic" replace />} />
                        </>
                      )}

                      {/* Fallback route for debugging */}
                      <Route path="*" element={
                        <div className="p-8 text-center">
                          <h1 className="text-2xl font-bold text-red-600 mb-4">⚠️ Route Not Found</h1>
                          <p className="text-gray-600 mb-4">Hostname: {hostname}</p>
                          <p className="text-gray-600 mb-4">Pathname: {window.location.pathname}</p>
                          <p className="text-gray-600 mb-4">Is Marketing: {isMarketingWebsite.toString()}</p>
                          <p className="text-gray-600 mb-4">Is Admin: {isAdminDomain.toString()}</p>
                          <p className="text-gray-600 mb-4">Is Connect: {isConnectSubdomain.toString()}</p>
                          <p className="text-gray-600 mb-4">Is Production Tenant: {isProductionTenant.toString()}</p>
                          <p className="text-gray-600 mb-4">Domain Config: {JSON.stringify(domainConfig)}</p>
                          <div className="mt-4">
                            <a href="/dashboard" className="text-blue-600 hover:underline mr-4">Try Dashboard</a>
                            <a href="/chiropractic" className="text-blue-600 hover:underline mr-4">Try Chiropractic</a>
                            <a href="/dental-sleep" className="text-blue-600 hover:underline mr-4">Try Dental Sleep</a>
                            <a href="/general-dentistry" className="text-blue-600 hover:underline">Try General Dentistry</a>
                          </div>
                        </div>
                      } />
                    </Routes>
                  </Router>
                </SageAIProvider>
              </ApplicationProvider>
            </SpecialtyProvider>
          </AuthProvider>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
