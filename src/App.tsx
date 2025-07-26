
console.log('🚀 [DIAGNOSTIC] App.tsx - Starting imports');

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthProvider";
import { HealthCheck } from "@/components/health/HealthCheck";
import { TenantWrapper } from "@/components/wrappers/TenantWrapper";
import { parseTenantFromUrl } from "@/utils/tenantRouting";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TenantRedirect } from "@/components/TenantRedirect";
import "@/utils/routeTestRunner"; // Enable route testing functions

// Specialty Apps
import ChiropracticApp from "@/apps/ChiropracticApp";
import DentalSleepApp from "@/apps/DentalSleepApp";
import DentalApp from "@/apps/DentalApp";

// Landing page for non-tenant routes
import Index from "./pages/Index";

console.log('✅ [DIAGNOSTIC] App.tsx - All imports completed');

console.log('🚀 [DIAGNOSTIC] App.tsx - Creating QueryClient');
const queryClient = new QueryClient();
console.log('✅ [DIAGNOSTIC] App.tsx - QueryClient created successfully');

const TenantRouter: React.FC = () => {
  console.log('🚀 [DIAGNOSTIC] TenantRouter - Component initializing');
  const tenantRoute = parseTenantFromUrl();
  const currentPath = window.location.pathname;
  
  console.log('🚦 [CRITICAL DEBUG] TenantRouter - tenantRoute:', JSON.stringify(tenantRoute, null, 2));
  console.log('🚦 [CRITICAL DEBUG] TenantRouter - currentPath:', currentPath);
  
  // Phase 2: Clean app-level routing without conflicting redirects
  if (tenantRoute) {
    console.log('🎯 [CRITICAL DEBUG] Tenant detected:', tenantRoute.specialty, 'isProduction:', tenantRoute.isProduction);
    
    // Set document title based on tenant
    const brandNames: Record<string, string> = {
      'dental-sleep-medicine': 'Midwest Dental Sleep Medicine - FlowIQ',
      'chiropractic-care': 'West County Spine Care - FlowIQ',
      'general-dentistry': 'FlowIQ - Dental Practice'
    };
    document.title = brandNames[tenantRoute.specialty] || 'FlowIQ';
    
    // Render appropriate app based on specialty
    switch (tenantRoute.specialty) {
      case 'dental-sleep-medicine':
        console.log('🦷 [CRITICAL DEBUG] MATCH! Rendering DentalSleepApp for specialty:', tenantRoute.specialty);
        console.log('🦷 [DEBUG] About to render DentalSleepApp component');
        return <DentalSleepApp />;
        
      case 'chiropractic-care':
        console.log('🦴 Rendering ChiropracticApp for path:', currentPath);
        return <ChiropracticApp />;
        
      case 'general-dentistry':
      default:
        console.log('🦷 [CRITICAL DEBUG] Using DentalApp fallback for specialty:', tenantRoute.specialty);
        return <DentalApp />;
    }
  }
  
  console.log('🚨 [CRITICAL DEBUG] NO TENANT DETECTED - tenantRoute is:', tenantRoute);
  // No tenant detected - check if it's an app route or landing page route
  const isAppRoute = (path: string) => {
    const appPaths = ['/agents/', '/dashboard', '/schedule', '/calendar', '/analytics', '/ehr', '/patient-management', '/financial', '/patient-experience', '/ai-automation', '/team', '/checkin', '/insights', '/notifications', '/help', '/settings'];
    return appPaths.some(appPath => path.startsWith(appPath));
  };

  if (isAppRoute(currentPath)) {
    console.log('🎯 No tenant detected, but app route detected. Routing to ChiropracticApp for path:', currentPath);
    document.title = 'FlowIQ - Chiropractic Care';
    return <ChiropracticApp />;
  }
  
  // Only show landing page for actual landing routes
  console.log('🏠 No tenant detected, showing landing page for path:', currentPath);
  document.title = 'FlowIQ - AI Operating System';
  return <Index />;
};

const App = () => {
  console.log('🚀 [CRITICAL DEBUG] App - Component rendering START');
  
  try {
    console.log('🚀 [CRITICAL DEBUG] App - About to render JSX');
    return (
      <ErrorBoundary 
        onError={(error, errorInfo) => {
          console.error('🚨 [DIAGNOSTIC] ErrorBoundary caught error:', error, errorInfo);
        }}
      >
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthProvider>
                <TenantRedirect />
                <TenantWrapper>
                  {(() => {
                    console.log('🚀 [CRITICAL DEBUG] App - About to render Routes');
                    return (
                      <Routes>
                {/* Health check route */}
                <Route path="/health" element={<HealthCheck />} />
                
                {/* Specialty app routes for development - only on non-production */}
                <Route path="/chiropractic/*" element={<TenantRouter />} />
                <Route path="/chiropractic-care/*" element={<TenantRouter />} />
                <Route path="/dental-sleep/*" element={<TenantRouter />} />
                <Route path="/dental-sleep-medicine/*" element={<TenantRouter />} />
                <Route path="/dental/*" element={<TenantRouter />} />
                
                {/* Production tenant routes - dynamic based on tenant specialty */}
                <Route path="/dashboard" element={<TenantRouter />} />
                <Route path="/schedule" element={<TenantRouter />} />
                <Route path="/calendar" element={<TenantRouter />} />
                <Route path="/analytics" element={<TenantRouter />} />
                <Route path="/ehr" element={<TenantRouter />} />
                <Route path="/patient-management" element={<TenantRouter />} />
                <Route path="/financial" element={<TenantRouter />} />
                <Route path="/patient-experience" element={<TenantRouter />} />
                <Route path="/ai-automation" element={<TenantRouter />} />
                <Route path="/team" element={<TenantRouter />} />
                <Route path="/checkin" element={<TenantRouter />} />
                <Route path="/insights" element={<TenantRouter />} />
                <Route path="/notifications" element={<TenantRouter />} />
                <Route path="/help" element={<TenantRouter />} />
                <Route path="/settings" element={<TenantRouter />} />
                <Route path="/agents/*" element={<TenantRouter />} />
                
                {/* Redirect component paths to proper app routes */}
                <Route path="/components/dental-sleep/*" element={<Navigate to="/dental-sleep/dashboard" replace />} />
                
                {/* Main tenant routing for other routes */}
                <Route path="/*" element={
                  (() => {
                    console.log('🚀 [CRITICAL DEBUG] App - Catch-all route triggered for path:', window.location.pathname);
                    return <TenantRouter />;
                  })()
                } />
                      </Routes>
                    );
                  })()}
                </TenantWrapper>
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('🚨 [DIAGNOSTIC] App - Error during render:', error);
    return <div>App Error: {error.message}</div>;
  }
};

console.log('✅ [DIAGNOSTIC] App.tsx - Component definition completed');

export default App;
