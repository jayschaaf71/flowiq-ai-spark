
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
import FollowupIQ from "./pages/agents/FollowupIQ";
import ScribeIQ from "./pages/agents/ScribeIQ";
import RemindIQ from "./pages/agents/RemindIQ";
import ClaimsIQ from "./pages/agents/ClaimsIQ";
import BillingIQ from "./pages/agents/BillingIQ";
import InsightIQ from "./pages/agents/InsightIQ";

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
                <Route path="/agents/followup" element={<FollowupIQ />} />
                <Route path="/agents/remind" element={<RemindIQ />} />
                <Route path="/agents/scribe" element={<ScribeIQ />} />
                <Route path="/agents/claims" element={<ClaimsIQ />} />
                <Route path="/agents/billing" element={<BillingIQ />} />
                <Route path="/agents/insight" element={<InsightIQ />} />
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
