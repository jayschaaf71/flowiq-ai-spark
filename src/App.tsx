
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Workflows from "./pages/Workflows";
import Analytics from "./pages/Analytics";
import AIInsights from "./pages/AIInsights";
import Team from "./pages/Team";
import Templates from "./pages/Templates";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import PracticeSetup from "./pages/PracticeSetup";
import PatientManagement from "./pages/PatientManagement";
import ManagerAgent from "./pages/ManagerAgent";
import ScheduleIQ from "./pages/agents/ScheduleIQ";
import IntakeIQ from "./pages/agents/IntakeIQ";
import RemindIQ from "./pages/agents/RemindIQ";
import BillingIQ from "./pages/agents/BillingIQ";
import ClaimsIQ from "./pages/agents/ClaimsIQ";
import AssistIQ from "./pages/agents/AssistIQ";
import ScribeIQ from "./pages/agents/ScribeIQ";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/workflows" element={<Workflows />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/ai-insights" element={<AIInsights />} />
          <Route path="/team" element={<Team />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          <Route path="/practice-setup" element={<PracticeSetup />} />
          <Route path="/patients" element={<PatientManagement />} />
          <Route path="/manager" element={<ManagerAgent />} />
          <Route path="/agents/schedule" element={<ScheduleIQ />} />
          <Route path="/agents/intake" element={<IntakeIQ />} />
          <Route path="/agents/remind" element={<RemindIQ />} />
          <Route path="/agents/billing" element={<BillingIQ />} />
          <Route path="/agents/claims" element={<ClaimsIQ />} />
          <Route path="/agents/assist" element={<AssistIQ />} />
          <Route path="/agents/scribe" element={<ScribeIQ />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
