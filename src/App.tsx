import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SpecialtyProvider } from "@/contexts/SpecialtyContext";
import Dashboard from "@/pages/Dashboard";
import Index from "@/pages/Index";
import ComprehensiveDashboard from "@/pages/ComprehensiveDashboard";
import ChiroIQ from "./pages/ChiroIQ";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SpecialtyProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/comprehensive" element={<ComprehensiveDashboard />} />
                <Route path="/chiroiq" element={<ChiroIQ />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SpecialtyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
