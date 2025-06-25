import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SpecialtyProvider } from "@/contexts/SpecialtyContext";
import Dashboard from "@/pages/Dashboard";
import Index from "@/pages/Index";
import { ComprehensiveDashboard } from "@/pages/ComprehensiveDashboard";
import ChiroIQ from "./pages/ChiroIQ";
import PatientManagement from "./pages/PatientManagement";
import EHR from "./pages/EHR";
import Insights from "./pages/Insights";
import ScheduleIQ from "./pages/agents/ScheduleIQ";
import IntakeIQ from "./pages/agents/IntakeIQ";

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
                <Route path="/patient-management" element={<PatientManagement />} />
                <Route path="/ehr" element={<EHR />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/agents/schedule" element={<ScheduleIQ />} />
                <Route path="/agents/intake" element={<IntakeIQ />} />
                {/* Placeholder routes for other AI agents */}
                <Route path="/agents/remind" element={<div className="p-8 text-center text-gray-500">Remind iQ Coming Soon</div>} />
                <Route path="/agents/scribe" element={<div className="p-8 text-center text-gray-500">Scribe iQ Coming Soon</div>} />
                <Route path="/agents/claims" element={<div className="p-8 text-center text-gray-500">Claims iQ Coming Soon</div>} />
                <Route path="/agents/billing" element={<div className="p-8 text-center text-gray-500">Billing iQ Coming Soon</div>} />
                <Route path="/agents/followup" element={<div className="p-8 text-center text-gray-500">Follow up iQ Coming Soon</div>} />
                <Route path="/agents/insight" element={<div className="p-8 text-center text-gray-500">Insight iQ Coming Soon</div>} />
                <Route path="/manager" element={<div className="p-8 text-center text-gray-500">Manager Agent Coming Soon</div>} />
                <Route path="/team" element={<div className="p-8 text-center text-gray-500">Team Management Coming Soon</div>} />
                <Route path="/setup" element={<div className="p-8 text-center text-gray-500">Practice Setup Coming Soon</div>} />
                <Route path="/tenant-admin" element={<div className="p-8 text-center text-gray-500">Tenant Admin Coming Soon</div>} />
                <Route path="/settings" element={<div className="p-8 text-center text-gray-500">Settings Coming Soon</div>} />
                <Route path="/help" element={<div className="p-8 text-center text-gray-500">Help Coming Soon</div>} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SpecialtyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
