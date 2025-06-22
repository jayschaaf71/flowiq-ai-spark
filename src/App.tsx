
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SessionManager } from "@/components/auth/SessionManager";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

// Import all pages
import Index from "./pages/Index";
import ManagerAgent from "./pages/ManagerAgent";
import Workflows from "./pages/Workflows";
import Analytics from "./pages/Analytics";
import AIInsights from "./pages/AIInsights";
import Settings from "./pages/Settings";
import Templates from "./pages/Templates";
import Help from "./pages/Help";
import Team from "./pages/Team";
import PracticeSetup from "./pages/PracticeSetup";
import PatientManagement from "./pages/PatientManagement";
import TenantAdmin from "./pages/TenantAdmin";

// Agent pages
import ScheduleIQ from "./pages/agents/ScheduleIQ";
import ScheduleIQProduction from "./pages/agents/ScheduleIQProduction";
import IntakeIQ from "./pages/agents/IntakeIQ";
import RemindIQ from "./pages/agents/RemindIQ";
import BillingIQ from "./pages/agents/BillingIQ";
import ClaimsIQ from "./pages/agents/ClaimsIQ";
import EHRIQ from "./pages/agents/EHRIQ";
import ScribeIQ from "./pages/agents/ScribeIQ";

// Patient pages
import PatientAuth from "./pages/PatientAuth";
import PatientDashboard from "./pages/PatientDashboard";
import PatientLanding from "./pages/PatientLanding";
import BookAppointment from "./pages/BookAppointment";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle authentication-based navigation
const AuthNavigationHandler = () => {
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && profile) {
      console.log('User authenticated with role:', profile.role);
      // Navigation will be handled by the route components themselves
    }
  }, [user, profile, loading]);

  return null;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SessionManager>
          <Router>
            <AuthNavigationHandler />
            <Routes>
              {/* Public routes */}
              <Route path="/patient" element={<PatientLanding />} />
              <Route path="/patient/auth" element={<PatientAuth />} />
              <Route path="/book" element={<BookAppointment />} />
              
              {/* Patient protected routes */}
              <Route 
                path="/patient-dashboard" 
                element={
                  <ProtectedRoute requiredRole="patient">
                    <PatientDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Staff/Admin protected routes */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute requiredRole="staff">
                    <Index />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/manager" 
                element={
                  <ProtectedRoute requiredRole="staff">
                    <ManagerAgent />
                  </ProtectedRoute>
                } 
              />
              
              {/* Enterprise Tenant Administration */}
              <Route 
                path="/tenant-admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <TenantAdmin />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/workflows" 
                element={
                  <ProtectedRoute requiredRole="staff">
                    <Workflows />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/analytics" 
                element={
                  <ProtectedRoute requiredRole="staff">
                    <Analytics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/insights" 
                element={
                  <ProtectedRoute requiredRole="staff">
                    <AIInsights />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/patients" 
                element={
                  <ProtectedRoute requiredRole="staff">
                    <PatientManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/team" 
                element={
                  <ProtectedRoute requiredRole="staff">
                    <Team />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/schedule" 
                element={
                  <ProtectedRoute requiredRole="staff">
                    <ScheduleIQ />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/setup" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <PracticeSetup />
                  </ProtectedRoute>
                } 
              />
              
              {/* Agent routes */}
              <Route 
                path="/agents/schedule" 
                element={
                  <ProtectedRoute requiredRole="staff">
                    <ScheduleIQ />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/agents/schedule-production" 
                element={
                  <ProtectedRoute requiredRole="staff">
                    <ScheduleIQProduction />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/agents/intake" 
                element={
                  <ProtectedRoute requiredRole="staff">
                    <IntakeIQ />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/agents/remind" 
                element={
                  <ProtectedRoute requiredRole="staff">
                    <RemindIQ />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/agents/billing" 
                element={
                  <ProtectedRoute requiredRole="staff">
                    <BillingIQ />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/agents/claims" 
                element={
                  <ProtectedRoute requiredRole="staff">
                    <ClaimsIQ />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/agents/scribe" 
                element={
                  <ProtectedRoute requiredRole="staff">
                    <ScribeIQ />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/agents/ehr" 
                element={
                  <ProtectedRoute requiredRole="staff">
                    <EHRIQ />
                  </ProtectedRoute>
                } 
              />
              
              {/* Settings and other routes */}
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute requiredRole="staff">
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/templates" 
                element={
                  <ProtectedRoute requiredRole="staff">
                    <Templates />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/help" 
                element={
                  <ProtectedRoute>
                    <Help />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Router>
        </SessionManager>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
