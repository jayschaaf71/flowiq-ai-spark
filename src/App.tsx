
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthProvider';
import { SpecialtyProvider } from '@/contexts/SpecialtyContext';
import { Layout } from '@/components/Layout';

// Core Pages
import Index from '@/pages/Index';
import AuthPage from '@/pages/AuthPage';
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/Settings';
import PatientPortal from '@/pages/PatientPortal';
import { ProviderPortal } from '@/pages/ProviderPortal';
import StaffDashboard from '@/pages/StaffDashboard';
import PatientDashboard from '@/pages/PatientDashboard';
import PracticeSetup from '@/pages/PracticeSetup';
import PaymentSuccess from '@/pages/PaymentSuccess';
import PaymentCanceled from '@/pages/PaymentCanceled';

// Components
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <SpecialtyProvider>
          <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/practice-setup" element={<PracticeSetup />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-canceled" element={<PaymentCanceled />} />
            
            {/* Patient Portal and Dashboard */}
            <Route path="/patient-portal" element={
              <ProtectedRoute requiredRole="patient">
                <PatientPortal />
              </ProtectedRoute>
            } />
            <Route path="/patient-dashboard" element={
              <ProtectedRoute requiredRole="patient">
                <Layout>
                  <PatientDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Staff Portal and Dashboard */}
            <Route path="/provider-portal" element={
              <ProtectedRoute requiredRole="staff">
                <ProviderPortal />
              </ProtectedRoute>
            } />
            <Route path="/staff-dashboard" element={
              <ProtectedRoute requiredRole="staff">
                <Layout>
                  <StaffDashboard />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Main Dashboard with Layout */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Settings with Layout */}
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Router>
        </SpecialtyProvider>
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
