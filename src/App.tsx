
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
    
    console.log('Production tenant detected, checking for redirect. Current path:', currentPath);
    
    // For production tenants, redirect to remove the specialty prefix from URL
    // e.g. /chiropractic/dashboard -> /dashboard
    if (currentPath.startsWith('/chiropractic/')) {
      const newPath = currentPath.replace('/chiropractic', '');
      console.log('Redirecting from', currentPath, 'to', newPath || '/');
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
    
    switch (tenantRoute.specialty) {
      case 'dental-sleep-medicine':
        return <DentalSleepApp />;
      case 'chiropractic-care':
        return <ChiropracticApp />;
      case 'general-dentistry':
      case 'dental-care':
        return <DentalApp />;
      default:
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
                
                {/* Specialty app routes for development */}
                <Route path="/chiropractic/*" element={<ChiropracticApp />} />
                <Route path="/dental-sleep/*" element={<DentalSleepApp />} />
                <Route path="/dental/*" element={<DentalApp />} />
                
                {/* Main chiropractic app routes - direct routing */}
                <Route path="/dashboard" element={<ChiropracticApp />} />
                <Route path="/schedule" element={<ChiropracticApp />} />
                <Route path="/calendar" element={<ChiropracticApp />} />
                <Route path="/analytics" element={<ChiropracticApp />} />
                <Route path="/ehr" element={<ChiropracticApp />} />
                <Route path="/patient-management" element={<ChiropracticApp />} />
                <Route path="/financial" element={<ChiropracticApp />} />
                <Route path="/patient-experience" element={<ChiropracticApp />} />
                <Route path="/ai-automation" element={<ChiropracticApp />} />
                <Route path="/team" element={<ChiropracticApp />} />
                <Route path="/checkin" element={<ChiropracticApp />} />
                <Route path="/insights" element={<ChiropracticApp />} />
                <Route path="/notifications" element={<ChiropracticApp />} />
                <Route path="/help" element={<ChiropracticApp />} />
                <Route path="/settings" element={<ChiropracticApp />} />
                <Route path="/agents/*" element={<ChiropracticApp />} />
                
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
