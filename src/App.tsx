
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthProvider";
import { HealthCheck } from "@/components/health/HealthCheck";
import { TenantWrapper } from "@/components/wrappers/TenantWrapper";
import { parseTenantFromUrl } from "@/utils/tenantRouting";

// Specialty Apps
import ChiropracticApp from "@/apps/ChiropracticApp";
import DentalSleepApp from "@/apps/DentalSleepApp";
import DentalApp from "@/apps/DentalApp";

// Landing page for non-tenant routes
import Index from "./pages/Index";

const queryClient = new QueryClient();

const TenantRouter = () => {
  const tenantRoute = parseTenantFromUrl();
  
  console.log('TenantRouter: Detected tenant route:', tenantRoute);
  
  // If we have a production tenant (subdomain), load the appropriate app
  if (tenantRoute?.isProduction) {
    const currentPath = window.location.pathname;
    
    // Set document title based on tenant
    const brandName = tenantRoute.subdomain === 'west-county-spine' ? 'West County Spine' : 
                     tenantRoute.subdomain === 'midwest-dental-sleep' ? 'Midwest Dental Sleep' : 'FlowIQ';
    document.title = brandName;
    
    console.log('Production tenant detected, checking for redirect. Current path:', currentPath, 'tenant specialty:', tenantRoute.specialty);
    
    // For production tenants, redirect to remove the specialty prefix from URL
    // e.g. /chiropractic/dashboard -> /dashboard
    if (currentPath.startsWith('/chiropractic/')) {
      const newPath = currentPath.replace('/chiropractic', '');
      console.log('Redirecting from', currentPath, 'to', newPath || '/', 'for tenant:', tenantRoute.specialty);
      window.location.replace(newPath || '/');
      return null; // Prevent rendering during redirect
    } else if (currentPath.startsWith('/dental-sleep/')) {
      const newPath = currentPath.replace('/dental-sleep', '');
      console.log('Redirecting from', currentPath, 'to', newPath || '/');
      window.location.replace(newPath || '/');
      return null; // Prevent rendering during redirect
    } else if (currentPath.startsWith('/dental/')) {
      const newPath = currentPath.replace('/dental', '');
      console.log('Redirecting from', currentPath, 'to', newPath || '/');
      window.location.replace(newPath || '/');
      return null; // Prevent rendering during redirect
    }
    
    console.log('No redirect needed, rendering app for specialty:', tenantRoute.specialty);
    
    switch (tenantRoute.specialty) {
      case 'dental-sleep-medicine':
        console.log('Rendering DentalSleepApp for production tenant');
        return <DentalSleepApp />;
      case 'chiropractic-care':
        console.log('Rendering ChiropracticApp for production tenant');
        return <ChiropracticApp />;
      case 'general-dentistry':
      case 'dental-care':
        console.log('Rendering DentalApp for production tenant');
        return <DentalApp />;
      default:
        console.log('Unknown specialty, defaulting to ChiropracticApp');
        return <ChiropracticApp />; // Default fallback
    }
  }
  
  // For development or non-tenant routes, show landing page
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
                <Route path="/dental-sleep/*" element={<TenantRouter />} />
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
