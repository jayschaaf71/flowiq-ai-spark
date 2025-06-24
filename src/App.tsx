import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from './hooks/useAuth';
import PatientManagement from './pages/PatientManagement';
import { Layout } from './components/Layout';
import { EHRDashboard } from './components/ehr/EHRDashboard';
import ScheduleIQ from './pages/agents/ScheduleIQ';
import BookAppointment from './pages/BookAppointment';
import { PatientDashboard } from './pages/PatientDashboard';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ComprehensiveDashboard } from "./pages/ComprehensiveDashboard";
import ManagerAgent from './pages/ManagerAgent';
import IntakeIQ from './pages/agents/IntakeIQ';
import RemindIQ from './pages/agents/RemindIQ';
import BillingIQ from './pages/agents/BillingIQ';
import ClaimsIQ from './pages/agents/ClaimsIQ';
import EHRIQ from './pages/agents/EHRIQ';
import ScribeIQ from './pages/agents/ScribeIQ';
import FollowupIQ from './pages/agents/FollowupIQ';
import InsightIQ from './pages/agents/InsightIQ';
import Settings from './pages/Settings';
import Help from './pages/Help';
import AIInsights from './pages/AIInsights';
import PilotDashboard from "@/pages/PilotDashboard";
import OnboardNewTenant from './pages/OnboardNewTenant';
import { SpecialtyProvider } from './contexts/SpecialtyContext';

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        <SpecialtyProvider>
          <Router>
            <Toaster />
            
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <ComprehensiveDashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/onboard-tenant" element={
                <ProtectedRoute>
                  <OnboardNewTenant />
                </ProtectedRoute>
              } />
              
              <Route path="/patient-management" element={
                <ProtectedRoute requiredRole="staff">
                  <Layout>
                    <PatientManagement />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/ehr" element={
                <ProtectedRoute requiredRole="staff">
                  <Layout>
                    <EHRDashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/schedule" element={
                <ProtectedRoute>
                  <Layout>
                    <ScheduleIQ />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/book-appointment" element={
                <ProtectedRoute>
                  <Layout>
                    <BookAppointment />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/patient-dashboard" element={
                <ProtectedRoute requiredRole="patient">
                  <PatientDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/help" element={
                <ProtectedRoute>
                  <Layout>
                    <Help />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/insights" element={
                <ProtectedRoute>
                  <Layout>
                    <AIInsights />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* AI Agent Routes */}
              <Route path="/manager" element={
                <ProtectedRoute>
                  <Layout>
                    <ManagerAgent />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/agents/schedule" element={
                <ProtectedRoute>
                  <Layout>
                    <ScheduleIQ />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/agents/intake" element={
                <ProtectedRoute>
                  <Layout>
                    <IntakeIQ />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/agents/remind" element={
                <ProtectedRoute>
                  <Layout>
                    <RemindIQ />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/agents/billing" element={
                <ProtectedRoute>
                  <Layout>
                    <BillingIQ />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/agents/claims" element={
                <ProtectedRoute>
                  <Layout>
                    <ClaimsIQ />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/agents/ehr" element={
                <ProtectedRoute>
                  <Layout>
                    <EHRIQ />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/agents/scribe" element={
                <ProtectedRoute>
                  <Layout>
                    <ScribeIQ />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/agents/followup" element={
                <ProtectedRoute>
                  <Layout>
                    <FollowupIQ />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/agents/insight" element={
                <ProtectedRoute>
                  <Layout>
                    <InsightIQ />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/pilot-dashboard" element={<PilotDashboard />} />
            </Routes>
          </Router>
        </SpecialtyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
