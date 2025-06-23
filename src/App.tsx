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

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        <Router>
          <Toaster />
          
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <ComprehensiveDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/patient-management" element={
              <ProtectedRoute requiredRole="staff">
                <PatientManagement />
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
                <ScheduleIQ />
              </ProtectedRoute>
            } />
            
            <Route path="/book-appointment" element={
              <ProtectedRoute>
                <BookAppointment />
              </ProtectedRoute>
            } />
            
            <Route path="/patient-dashboard" element={
              <ProtectedRoute requiredRole="patient">
                <PatientDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
