
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthProvider";
import { DashboardProvider } from "./contexts/DashboardContext";
import { TenantWrapper } from "./components/wrappers/TenantWrapper";
import ErrorBoundary from "./components/ErrorBoundary";
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
import { FinancialManagementPage } from "./pages/FinancialManagementPage";
import { PatientExperiencePage } from "./pages/PatientExperiencePage";
import { ComplianceSecurityPage } from "./pages/ComplianceSecurityPage";
import { QualityAssurance } from "./components/QualityAssurance";

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 404s
        if ((error as any)?.status === 404) return false;
        return failureCount < 3;
      },
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <AuthProvider>
              <DashboardProvider>
                <BrowserRouter>
                  <ErrorBoundary>
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
                      
                      {/* Protected Routes with Tenant Wrapper */}
                      <Route path="/" element={<TenantWrapper><Layout><Index /></Layout></TenantWrapper>} />
                      <Route path="/dashboard" element={<TenantWrapper><Layout><Dashboard /></Layout></TenantWrapper>} />
                      <Route path="/comprehensive" element={<TenantWrapper><Layout><ComprehensiveDashboard /></Layout></TenantWrapper>} />
                      <Route path="/pilot" element={<TenantWrapper><Layout><PilotDashboard /></Layout></TenantWrapper>} />
                      <Route path="/chiro-iq" element={<TenantWrapper><Layout><ChiroIQ /></Layout></TenantWrapper>} />
                      <Route path="/patient-management" element={<TenantWrapper><Layout><PatientManagement /></Layout></TenantWrapper>} />
                      <Route path="/schedule" element={<TenantWrapper><Layout><Schedule /></Layout></TenantWrapper>} />
                      <Route path="/ehr" element={<TenantWrapper><Layout><EHR /></Layout></TenantWrapper>} />
                      <Route path="/analytics" element={<TenantWrapper><Layout><Analytics /></Layout></TenantWrapper>} />
                      <Route path="/insights" element={<TenantWrapper><Layout><Insights /></Layout></TenantWrapper>} />
                      <Route path="/ai-insights" element={<TenantWrapper><Layout><AIInsights /></Layout></TenantWrapper>} />
                      <Route path="/manager" element={<TenantWrapper><Layout><ManagerAgent /></Layout></TenantWrapper>} />
                      <Route path="/workflows" element={<TenantWrapper><Layout><Workflows /></Layout></TenantWrapper>} />
                      <Route path="/templates" element={<TenantWrapper><Layout><Templates /></Layout></TenantWrapper>} />
                      <Route path="/team" element={<TenantWrapper><Layout><Team /></Layout></TenantWrapper>} />
                      <Route path="/setup" element={<TenantWrapper><Layout><PracticeSetup /></Layout></TenantWrapper>} />
                      <Route path="/tenant-admin" element={<TenantWrapper><Layout><TenantAdmin /></Layout></TenantWrapper>} />
                      <Route path="/settings" element={<TenantWrapper><Layout><Settings /></Layout></TenantWrapper>} />
                      <Route path="/help" element={<TenantWrapper><Layout><Help /></Layout></TenantWrapper>} />
                      
                      {/* New Feature Routes */}
                      <Route path="/checkin" element={<TenantWrapper><Layout><CheckIn /></Layout></TenantWrapper>} />
                      <Route path="/notifications" element={<TenantWrapper><Layout><Notifications /></Layout></TenantWrapper>} />
                      <Route path="/provider-scheduling" element={<TenantWrapper><Layout><ProviderScheduling /></Layout></TenantWrapper>} />
                      <Route path="/financial" element={<TenantWrapper><Layout><FinancialManagementPage /></Layout></TenantWrapper>} />
                      <Route path="/patient-experience" element={<TenantWrapper><Layout><PatientExperiencePage /></Layout></TenantWrapper>} />
                      <Route path="/compliance" element={<TenantWrapper><Layout><ComplianceSecurityPage /></Layout></TenantWrapper>} />
                      <Route path="/quality-assurance" element={<TenantWrapper><Layout><QualityAssurance /></Layout></TenantWrapper>} />
                      
                      {/* Agent Routes */}
                      <Route path="/agents/schedule" element={<TenantWrapper><Layout><ScheduleIQ /></Layout></TenantWrapper>} />
                      <Route path="/agents/schedule-production" element={<TenantWrapper><Layout><ScheduleIQProduction /></Layout></TenantWrapper>} />
                      <Route path="/agents/intake" element={<TenantWrapper><Layout><IntakeIQ /></Layout></TenantWrapper>} />
                      <Route path="/agents/remind" element={<TenantWrapper><Layout><RemindIQ /></Layout></TenantWrapper>} />
                      <Route path="/agents/scribe" element={<TenantWrapper><Layout><ScribeIQ /></Layout></TenantWrapper>} />
                      <Route path="/agents/claims" element={<TenantWrapper><Layout><ClaimsIQ /></Layout></TenantWrapper>} />
                      <Route path="/agents/billing" element={<TenantWrapper><Layout><BillingIQ /></Layout></TenantWrapper>} />
                      <Route path="/agents/inventory" element={<TenantWrapper><Layout><InventoryIQ /></Layout></TenantWrapper>} />
                      <Route path="/agents/followup" element={<TenantWrapper><Layout><FollowupIQ /></Layout></TenantWrapper>} />
                      <Route path="/agents/insight" element={<TenantWrapper><Layout><InsightIQ /></Layout></TenantWrapper>} />
                      <Route path="/agents/assist" element={<TenantWrapper><Layout><AssistIQ /></Layout></TenantWrapper>} />
                      <Route path="/agents/ehr" element={<TenantWrapper><Layout><EHRIQ /></Layout></TenantWrapper>} />
                      
                      {/* 404 Route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </ErrorBoundary>
                </BrowserRouter>
              </DashboardProvider>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
