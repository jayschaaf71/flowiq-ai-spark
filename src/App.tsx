
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
    
    // For production tenants, redirect to remove the specialty prefix from URL
    // e.g. /chiropractic/dashboard -> /dashboard
    if (currentPath.startsWith('/chiropractic/')) {
      const newPath = currentPath.replace('/chiropractic', '');
      window.history.replaceState(null, '', newPath || '/');
    } else if (currentPath.startsWith('/dental-sleep/')) {
      const newPath = currentPath.replace('/dental-sleep', '');
      window.history.replaceState(null, '', newPath || '/');
    } else if (currentPath.startsWith('/dental/')) {
      const newPath = currentPath.replace('/dental', '');
      window.history.replaceState(null, '', newPath || '/');
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
                
                {/* Main tenant routing */}
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
