import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { TenantProtectedRoute } from "@/components/auth/TenantProtectedRoute";
import { SessionManager } from "@/components/auth/SessionManager";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";

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
import TenantOnboarding from "./pages/TenantOnboarding";

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
  const { primaryTenant, isPlatformAdmin } = useEnhancedAuth();

  useEffect(() => {
    if (!loading && user && profile) {
      console.log('User authenticated with role:', profile.role, 'Primary tenant:', primaryTenant?.tenant.name);
    }
  }, [user, profile, loading, primaryTenant]);

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
              
              {/* Staff/Admin protected routes with tenant context */}
              <Route 
                path="/" 
                element={
                  <TenantProtectedRoute requiredRole="staff">
                    <Index />
                  </TenantProtectedRoute>
                } 
              />
              <Route 
                path="/manager" 
                element={
                  <TenantProtectedRoute requiredRole="staff">
                    <ManagerAgent />
                  </TenantProtectedRoute>
                } 
              />
              
              {/* Platform Admin only - Tenant Administration */}
              <Route 
                path="/tenant-admin" 
                element={
                  <TenantProtectedRoute requiredRole="platform_admin">
                    <TenantAdmin />
                  </TenantProtectedRoute>
                } 
              />
              
              {/* Tenant Onboarding */}
              <Route 
                path="/tenant/:tenantId/onboarding" 
                element={
                  <TenantProtectedRoute requiredRole="tenant_admin">
                    <TenantOnboarding />
                  </TenantProtectedRoute>
                } 
              />
              
              <Route 
                path="/workflows" 
                element={
                  <TenantProtectedRoute requiredRole="staff">
                    <Workflows />
                  </TenantProtectedRoute>
                } 
              />
              <Route 
                path="/analytics" 
                element={
                  <TenantProtectedRoute requiredRole="staff">
                    <Analytics />
                  </TenantProtectedRoute>
                } 
              />
              <Route 
                path="/insights" 
                element={
                  <TenantProtectedRoute requiredRole="staff">
                    <AIInsights />
                  </TenantProtectedRoute>
                } 
              />
              <Route 
                path="/patients" 
                element={
                  <TenantProtectedRoute requiredRole="staff">
                    <PatientManagement />
                  </TenantProtectedRoute>
                } 
              />
              <Route 
                path="/team" 
                element={
                  <TenantProtectedRoute requiredRole="practice_manager">
                    <Team />
                  </TenantProtectedRoute>
                } 
              />
              <Route 
                path="/schedule" 
                element={
                  <TenantProtectedRoute requiredRole="staff">
                    <ScheduleIQ />
                  </TenantProtectedRoute>
                } 
              />
              <Route 
                path="/setup" 
                element={
                  <TenantProtectedRoute requiredRole="tenant_admin">
                    <PracticeSetup />
                  </TenantProtectedRoute>
                } 
              />
              
              {/* Agent routes */}
              <Route 
                path="/agents/schedule" 
                element={
                  <TenantProtectedRoute requiredRole="staff">
                    <ScheduleIQ />
                  </TenantProtectedRoute>
                } 
              />
              <Route 
                path="/agents/schedule-production" 
                element={
                  <TenantProtectedRoute requiredRole="staff">
                    <ScheduleIQProduction />
                  </TenantProtectedRoute>
                } 
              />
              <Route 
                path="/agents/intake" 
                element={
                  <TenantProtectedRoute requiredRole="staff">
                    <IntakeIQ />
                  </TenantProtectedRoute>
                } 
              />
              <Route 
                path="/agents/remind" 
                element={
                  <TenantProtectedRoute requiredRole="staff">
                    <RemindIQ />
                  </TenantProtectedRoute>
                } 
              />
              <Route 
                path="/agents/billing" 
                element={
                  <TenantProtectedRoute requiredRole="staff">
                    <BillingIQ />
                  </TenantProtectedRoute>
                } 
              />
              <Route 
                path="/agents/claims" 
                element={
                  <TenantProtectedRoute requiredRole="staff">
                    <ClaimsIQ />
                  </TenantProtectedRoute>
                } 
              />
              <Route 
                path="/agents/scribe" 
                element={
                  <TenantProtectedRoute requiredRole="staff">
                    <ScribeIQ />
                  </TenantProtectedRoute>
                } 
              />
              <Route 
                path="/agents/ehr" 
                element={
                  <TenantProtectedRoute requiredRole="staff">
                    <EHRIQ />
                  </TenantProtectedRoute>
                } 
              />
              
              {/* Settings and other routes */}
              <Route 
                path="/settings" 
                element={
                  <TenantProtectedRoute requiredRole="staff">
                    <Settings />
                  </TenantProtectedRoute>
                } 
              />
              <Route 
                path="/templates" 
                element={
                  <TenantProtectedRoute requiredRole="staff">
                    <Templates />
                  </TenantProtectedRoute>
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
