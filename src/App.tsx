
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import PracticeSetup from "./pages/PracticeSetup";
import PatientManagement from "./pages/PatientManagement";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Team from "./pages/Team";
import Templates from "./pages/Templates";
import Workflows from "./pages/Workflows";
import Help from "./pages/Help";
import AIInsights from "./pages/AIInsights";
import ManagerAgent from "./pages/ManagerAgent";
import PatientLanding from "./pages/PatientLanding";
import PatientAuth from "./pages/PatientAuth";
import PatientDashboard from "./pages/PatientDashboard";
import BookAppointment from "./pages/BookAppointment";
import NotFound from "./pages/NotFound";

// AI Agents
import ScheduleIQ from "./pages/agents/ScheduleIQ";
import ScheduleIQProduction from "./pages/agents/ScheduleIQProduction";
import IntakeIQ from "./pages/agents/IntakeIQ";
import RemindIQ from "./pages/agents/RemindIQ";
import BillingIQ from "./pages/agents/BillingIQ";
import ClaimsIQ from "./pages/agents/ClaimsIQ";
import ScribeIQ from "./pages/agents/ScribeIQ";
import AssistIQ from "./pages/agents/AssistIQ";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/patient" element={<PatientLanding />} />
            <Route path="/patient/auth" element={<PatientAuth />} />
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/book" element={<BookAppointment />} />
            
            {/* Protected routes */}
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/setup" element={<ProtectedRoute><PracticeSetup /></ProtectedRoute>} />
            <Route path="/patients" element={<ProtectedRoute><PatientManagement /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
            <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
            <Route path="/workflows" element={<ProtectedRoute><Workflows /></ProtectedRoute>} />
            <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
            <Route path="/ai-insights" element={<ProtectedRoute><AIInsights /></ProtectedRoute>} />
            <Route path="/manager" element={<ProtectedRoute><ManagerAgent /></ProtectedRoute>} />
            
            {/* AI Agents */}
            <Route path="/agents/schedule" element={<ProtectedRoute><ScheduleIQ /></ProtectedRoute>} />
            <Route path="/agents/schedule-production" element={<ProtectedRoute><ScheduleIQProduction /></ProtectedRoute>} />
            <Route path="/agents/intake" element={<ProtectedRoute><IntakeIQ /></ProtectedRoute>} />
            <Route path="/agents/remind" element={<ProtectedRoute><RemindIQ /></ProtectedRoute>} />
            <Route path="/agents/billing" element={<ProtectedRoute><BillingIQ /></ProtectedRoute>} />
            <Route path="/agents/claims" element={<ProtectedRoute><ClaimsIQ /></ProtectedRoute>} />
            <Route path="/agents/scribe" element={<ProtectedRoute><ScribeIQ /></ProtectedRoute>} />
            <Route path="/agents/assist" element={<ProtectedRoute><AssistIQ /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
