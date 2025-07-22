
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Layout } from "@/components/Layout";

// Page imports
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import { Calendar } from "./pages/Calendar";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import PlatformAdmin from "./pages/PlatformAdmin";
import { HealthCheck } from "@/components/health/HealthCheck";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/health" element={<HealthCheck />} />
                  
                  {/* Main app routes with layout */}
                  <Route path="/*" element={
                    <ProtectedRoute>
                      <Layout>
                        <Routes>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/calendar" element={<Calendar />} />
                          <Route path="/analytics" element={<Analytics />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/platform-admin" element={<PlatformAdmin />} />
                        </Routes>
                      </Layout>
                    </ProtectedRoute>
                  } />
                </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
