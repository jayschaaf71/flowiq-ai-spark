
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthProvider";
import { HealthCheck } from "@/components/health/HealthCheck";
import { TenantWrapper } from "@/components/wrappers/TenantWrapper";
import { parseTenantFromUrl } from "@/utils/tenantRouting";
import "@/utils/routeTestRunner"; // Enable route testing functions

// Specialty Apps
import ChiropracticApp from "@/apps/ChiropracticApp";
import DentalSleepApp from "@/apps/DentalSleepApp";
import DentalApp from "@/apps/DentalApp";

// Landing page for non-tenant routes
import Index from "./pages/Index";

const queryClient = new QueryClient();

const TenantRouter: React.FC = () => {
  const tenantRoute = parseTenantFromUrl();
  const currentPath = window.location.pathname;
  
  console.log('🚦 TenantRouter - tenantRoute:', tenantRoute, 'currentPath:', currentPath);
  
  // Phase 2: Clean app-level routing without conflicting redirects
  if (tenantRoute) {
    console.log('🎯 Tenant detected:', tenantRoute.specialty, 'isProduction:', tenantRoute.isProduction);
    
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
        console.log('🦷 Rendering DentalSleepApp');
        return <DentalSleepApp />;
        
      case 'chiropractic-care':
        console.log('🦴 Rendering ChiropracticApp');
        return <ChiropracticApp />;
        
      case 'general-dentistry':
      default:
        console.log('🦷 Rendering DentalApp');
        return <DentalApp />;
    }
  }
  
  // No tenant detected - show landing page
  console.log('🏠 No tenant detected, showing landing page');
  document.title = 'FlowIQ - AI Operating System';
  return <Index />;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <TenantWrapper>
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
                
                {/* Main tenant routing for other routes */}
                <Route path="/*" element={<TenantRouter />} />
              </Routes>
            </TenantWrapper>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
