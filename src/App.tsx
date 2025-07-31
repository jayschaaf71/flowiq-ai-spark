
console.log('🚀 [DIAGNOSTIC] App.tsx - Starting imports');

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { AuthProvider } from './contexts/AuthProvider';
import { ChiropracticApp } from './apps/ChiropracticApp';
import { DentalSleepApp } from './components/dental-sleep/DentalSleepApp';
import CommunicationIQApp from './apps/CommunicationIQApp';
import { HealthCheck } from './components/health/HealthCheck';
import { MarketingHomepage } from './pages/MarketingHomepage';
import { HealthcareLanding } from './pages/HealthcareLanding';
import { ConnectLanding } from './pages/ConnectLanding';
import { SignupPage } from './pages/SignupPage';
import PlatformAdmin from './pages/PlatformAdmin';
import { getDomainConfig, isProductionDomain, parseTenantFromUrl } from './config/unifiedRouting';

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

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <Router>
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
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/login" element={<Navigate to="/chiropractic/login" replace />} />
                </>
              )}

              {/* Development routes */}
              <Route path="/chiropractic/*" element={<ChiropracticApp />} />
              <Route path="/dental-sleep/*" element={<DentalSleepApp />} />
              <Route path="/communication/*" element={<CommunicationIQApp />} />

              {/* Production domain routing using unified system */}
              {isProduction && tenantRoute && (
                <>
                  {tenantRoute.defaultApp === 'dentalSleep' && (
                    <Route path="/*" element={<DentalSleepApp />} />
                  )}
                  {tenantRoute.defaultApp === 'chiropractic' && (
                    <Route path="/*" element={<ChiropracticApp />} />
                  )}
                  {tenantRoute.defaultApp === 'communication' && (
                    <Route path="/*" element={<CommunicationIQApp />} />
                  )}
                </>
              )}

              {/* Fallback - redirect to marketing homepage for main domain, admin for admin domain, chiropractic for others */}
              <Route path="*" element={
                isMarketingWebsite 
                  ? <Navigate to="/" replace />
                  : isAdminDomain
                  ? <Navigate to="/platform-admin" replace />
                  : <Navigate to="/chiropractic/dashboard" replace />
              } />
            </Routes>
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
