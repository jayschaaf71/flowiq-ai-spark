
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import PracticeSetup from "./pages/PracticeSetup";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Team from "./pages/Team";
import PatientManagement from "./pages/PatientManagement";
import AIInsights from "./pages/AIInsights";
import Workflows from "./pages/Workflows";
import Templates from "./pages/Templates";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

// Agent Pages
import ScheduleIQ from "./pages/agents/ScheduleIQ";
import ScheduleIQProduction from "./pages/agents/ScheduleIQProduction";
import IntakeIQ from "./pages/agents/IntakeIQ";
import RemindIQ from "./pages/agents/RemindIQ";
import BillingIQ from "./pages/agents/BillingIQ";
import ClaimsIQ from "./pages/agents/ClaimsIQ";
import ScribeIQ from "./pages/agents/ScribeIQ";
import AssistIQ from "./pages/agents/AssistIQ";
import ManagerAgent from "./pages/ManagerAgent";

// Patient Portal Pages
import PatientLanding from "./pages/PatientLanding";
import PatientAuth from "./pages/PatientAuth";
import PatientDashboard from "./pages/PatientDashboard";
import BookAppointment from "./pages/BookAppointment";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Main Application Routes */}
              <Route path="/" element={<PatientLanding />} />
              <Route path="/admin" element={<Index />} />
              <Route path="/setup" element={<PracticeSetup />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/team" element={<Team />} />
              <Route path="/patients" element={<PatientManagement />} />
              <Route path="/insights" element={<AIInsights />} />
              <Route path="/workflows" element={<Workflows />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/help" element={<Help />} />
              <Route path="/manager" element={<ManagerAgent />} />

              {/* Agent Routes */}
              <Route path="/agents/schedule" element={<ScheduleIQ />} />
              <Route path="/agents/schedule-production" element={<ScheduleIQProduction />} />
              <Route path="/agents/intake" element={<IntakeIQ />} />
              <Route path="/agents/remind" element={<RemindIQ />} />
              <Route path="/agents/billing" element={<BillingIQ />} />
              <Route path="/agents/claims" element={<ClaimsIQ />} />
              <Route path="/agents/scribe" element={<ScribeIQ />} />
              <Route path="/agents/assist" element={<AssistIQ />} />

              {/* Patient Portal Routes */}
              <Route path="/patient-auth" element={<PatientAuth />} />
              <Route path="/patient-dashboard" element={<PatientDashboard />} />
              <Route path="/book-appointment" element={<BookAppointment />} />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
