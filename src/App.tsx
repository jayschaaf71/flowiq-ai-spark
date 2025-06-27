
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthProvider";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import PatientManagement from "./pages/PatientManagement";
import Schedule from "./pages/Schedule";
import EHR from "./pages/EHR";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import Team from "./pages/Team";
import PracticeSetup from "./pages/PracticeSetup";
import TenantAdmin from "./pages/TenantAdmin";
import Analytics from "./pages/Analytics";
import Insights from "./pages/Insights";
import ManagerAgent from "./pages/ManagerAgent";
import Workflows from "./pages/Workflows";
import Templates from "./pages/Templates";
import NotFound from "./pages/NotFound";
import { ComprehensiveDashboard } from "./pages/ComprehensiveDashboard";
import ChiroIQ from "./pages/ChiroIQ";
import AIInsights from "./pages/AIInsights";
import PilotDemo from "./pages/PilotDemo";
import PilotDashboard from "./pages/PilotDashboard";
import PatientLanding from "./pages/PatientLanding";
import PatientAuth from "./pages/PatientAuth";
import PatientDashboard from "./pages/PatientDashboard";
import BookAppointment from "./pages/BookAppointment";
import RescheduleAppointment from "./pages/RescheduleAppointment";
import AcceptInvitation from "./pages/AcceptInvitation";
import TenantOnboarding from "./pages/TenantOnboarding";
import OnboardNewTenant from "./pages/OnboardNewTenant";

// New pages
import CheckIn from "./pages/CheckIn";
import Notifications from "./pages/Notifications";
import ProviderScheduling from "./pages/ProviderScheduling";

// Agent Pages
import ScheduleIQ from "./pages/agents/ScheduleIQ";
import ScheduleIQProduction from "./pages/agents/ScheduleIQProduction";
import IntakeIQ from "./pages/agents/IntakeIQ";
import RemindIQ from "./pages/agents/RemindIQ";
import ScribeIQ from "./pages/agents/ScribeIQ";
import ClaimsIQ from "./pages/agents/ClaimsIQ";
import BillingIQ from "./pages/agents/BillingIQ";
import FollowupIQ from "./pages/agents/FollowupIQ";
import InsightIQ from "./pages/agents/InsightIQ";
import AssistIQ from "./pages/agents/AssistIQ";
import EHRIQ from "./pages/agents/EHRIQ";
import InventoryIQ from "./pages/agents/InventoryIQ";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/patient" element={<PatientLanding />} />
                <Route path="/patient/auth" element={<PatientAuth />} />
                <Route path="/patient/dashboard" element={<PatientDashboard />} />
                <Route path="/book-appointment" element={<BookAppointment />} />
                <Route path="/reschedule/:appointmentId" element={<RescheduleAppointment />} />
                <Route path="/accept-invitation" element={<AcceptInvitation />} />
                <Route path="/onboard-tenant" element={<OnboardNewTenant />} />
                <Route path="/tenant-onboarding" element={<TenantOnboarding />} />
                <Route path="/pilot-demo" element={<PilotDemo />} />
                
                {/* Protected Routes */}
                <Route path="/" element={<Layout><Index /></Layout>} />
                <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                <Route path="/comprehensive" element={<Layout><ComprehensiveDashboard /></Layout>} />
                <Route path="/pilot" element={<Layout><PilotDashboard /></Layout>} />
                <Route path="/chiro-iq" element={<Layout><ChiroIQ /></Layout>} />
                <Route path="/patient-management" element={<Layout><PatientManagement /></Layout>} />
                <Route path="/schedule" element={<Layout><Schedule /></Layout>} />
                <Route path="/ehr" element={<Layout><EHR /></Layout>} />
                <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
                <Route path="/insights" element={<Layout><Insights /></Layout>} />
                <Route path="/ai-insights" element={<Layout><AIInsights /></Layout>} />
                <Route path="/manager" element={<Layout><ManagerAgent /></Layout>} />
                <Route path="/workflows" element={<Layout><Workflows /></Layout>} />
                <Route path="/templates" element={<Layout><Templates /></Layout>} />
                <Route path="/team" element={<Layout><Team /></Layout>} />
                <Route path="/setup" element={<Layout><PracticeSetup /></Layout>} />
                <Route path="/tenant-admin" element={<Layout><TenantAdmin /></Layout>} />
                <Route path="/settings" element={<Layout><Settings /></Layout>} />
                <Route path="/help" element={<Layout><Help /></Layout>} />
                
                {/* New Feature Routes */}
                <Route path="/checkin" element={<Layout><CheckIn /></Layout>} />
                <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
                <Route path="/provider-scheduling" element={<Layout><ProviderScheduling /></Layout>} />
                
                {/* Agent Routes */}
                <Route path="/agents/schedule" element={<Layout><ScheduleIQ /></Layout>} />
                <Route path="/agents/schedule-production" element={<Layout><ScheduleIQProduction /></Layout>} />
                <Route path="/agents/intake" element={<Layout><IntakeIQ /></Layout>} />
                <Route path="/agents/remind" element={<Layout><RemindIQ /></Layout>} />
                <Route path="/agents/scribe" element={<Layout><ScribeIQ /></Layout>} />
                <Route path="/agents/claims" element={<Layout><ClaimsIQ /></Layout>} />
                <Route path="/agents/billing" element={<Layout><BillingIQ /></Layout>} />
                <Route path="/agents/inventory" element={<Layout><InventoryIQ /></Layout>} />
                <Route path="/agents/followup" element={<Layout><FollowupIQ /></Layout>} />
                <Route path="/agents/insight" element={<Layout><InsightIQ /></Layout>} />
                <Route path="/agents/assist" element={<Layout><AssistIQ /></Layout>} />
                <Route path="/agents/ehr" element={<Layout><EHRIQ /></Layout>} />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
