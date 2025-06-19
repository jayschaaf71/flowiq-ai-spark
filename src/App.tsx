
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SessionManager } from "@/components/auth/SessionManager";
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
      <SessionManager>
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
              
              {/* Protected routes - Main application (Staff/Admin) */}
              <Route path="/" element={<ProtectedRoute requiredRole="staff"><Index /></ProtectedRoute>} />
              <Route path="/setup" element={<ProtectedRoute requiredRole="admin"><PracticeSetup /></ProtectedRoute>} />
              <Route path="/patients" element={<ProtectedRoute requiredRole="staff"><PatientManagement /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute requiredRole="staff"><Analytics /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute requiredRole="admin"><Settings /></ProtectedRoute>} />
              <Route path="/team" element={<ProtectedRoute requiredRole="admin"><Team /></ProtectedRoute>} />
              <Route path="/templates" element={<ProtectedRoute requiredRole="staff"><Templates /></ProtectedRoute>} />
              <Route path="/workflows" element={<ProtectedRoute requiredRole="staff"><Workflows /></ProtectedRoute>} />
              <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
              <Route path="/ai-insights" element={<ProtectedRoute requiredRole="staff"><AIInsights /></ProtectedRoute>} />
              <Route path="/manager" element={<ProtectedRoute requiredRole="admin"><ManagerAgent /></ProtectedRoute>} />
              
              {/* AI Agents - Staff access required */}
              <Route path="/agents/schedule" element={<ProtectedRoute requiredRole="staff"><ScheduleIQ /></ProtectedRoute>} />
              <Route path="/agents/schedule-production" element={<ProtectedRoute requiredRole="staff"><ScheduleIQProduction /></ProtectedRoute>} />
              <Route path="/agents/intake" element={<ProtectedRoute requiredRole="staff"><IntakeIQ /></ProtectedRoute>} />
              <Route path="/agents/remind" element={<ProtectedRoute requiredRole="staff"><RemindIQ /></ProtectedRoute>} />
              <Route path="/agents/billing" element={<ProtectedRoute requiredRole="staff"><BillingIQ /></ProtectedRoute>} />
              <Route path="/agents/claims" element={<ProtectedRoute requiredRole="staff"><ClaimsIQ /></ProtectedRoute>} />
              <Route path="/agents/scribe" element={<ProtectedRoute requiredRole="staff"><ScribeIQ /></ProtectedRoute>} />
              <Route path="/agents/assist" element={<ProtectedRoute requiredRole="staff"><AssistIQ /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SessionManager>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
