
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

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
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
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
