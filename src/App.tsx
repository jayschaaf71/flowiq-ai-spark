
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
import { HealthCheck } from './components/health/HealthCheck';
import { getDomainConfig, isProductionDomain } from './config/productionRouting';

// Create QueryClient instance
const queryClient = new QueryClient();

function App() {
  console.log('🚀 App: Rendering main App component');

  // Get domain configuration
  const hostname = window.location.hostname;
  const domainConfig = getDomainConfig(hostname);
  const isProduction = isProductionDomain(hostname);

  console.log('🌐 Domain config:', {
    hostname,
    domainConfig,
    isProduction
  });

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

              {/* Development routes */}
              <Route path="/chiropractic/*" element={<ChiropracticApp />} />
              <Route path="/dental-sleep/*" element={<DentalSleepApp />} />

              {/* Production domain routing */}
              {isProduction && domainConfig.defaultApp === 'dentalSleep' && (
                <Route path="/*" element={<DentalSleepApp />} />
              )}

              {isProduction && domainConfig.defaultApp === 'chiropractic' && (
                <Route path="/*" element={<ChiropracticApp />} />
              )}

              {/* Fallback - redirect to chiropractic for localhost */}
              <Route path="*" element={<Navigate to="/chiropractic/dashboard" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
