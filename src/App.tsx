
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthProvider';
import { SpecialtyProvider } from '@/contexts/SpecialtyContext';
import { Layout } from '@/components/Layout';
import { ErrorBoundary } from '@/components/ErrorBoundary';

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
import { BillingDashboard } from '@/pages/BillingDashboard';
import { AnalyticsDashboard } from '@/pages/AnalyticsDashboard';
import { ClinicalDashboard } from '@/pages/ClinicalDashboard';
import PatientScheduling from '@/pages/PatientScheduling';
import HealthEducation from '@/pages/HealthEducation';
import TelemedicineDashboard from '@/pages/TelemedicineDashboard';

// Components
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: false,
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
    <ErrorBoundary>
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
                    <ErrorBoundary>
                      <PatientPortal />
                    </ErrorBoundary>
                  </ProtectedRoute>
                } />
                <Route path="/patient-dashboard" element={
                  <ProtectedRoute requiredRole="patient">
                    <ErrorBoundary>
                      <Layout>
                        <PatientDashboard />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                } />
                
                {/* Staff Portal and Dashboard */}
                <Route path="/provider-portal" element={
                  <ProtectedRoute requiredRole="staff">
                    <ErrorBoundary>
                      <ProviderPortal />
                    </ErrorBoundary>
                  </ProtectedRoute>
                } />
                <Route path="/staff-dashboard" element={
                  <ProtectedRoute requiredRole="staff">
                    <ErrorBoundary>
                      <Layout>
                        <StaffDashboard />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                } />

                {/* Main Dashboard with Layout */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                } />

                {/* Settings with Layout */}
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <Layout>
                        <Settings />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                } />

                {/* Billing Dashboard with Layout */}
                <Route path="/billing" element={
                  <ProtectedRoute requiredRole="staff">
                    <ErrorBoundary>
                      <Layout>
                        <BillingDashboard />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                } />

                {/* Analytics Dashboard with Layout */}
                <Route path="/analytics" element={
                  <ProtectedRoute requiredRole="staff">
                    <ErrorBoundary>
                      <Layout>
                        <AnalyticsDashboard />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                } />

                {/* Clinical Dashboard with Layout */}
                <Route path="/clinical" element={
                  <ProtectedRoute requiredRole="staff">
                    <ErrorBoundary>
                      <Layout>
                        <ClinicalDashboard />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                } />

                {/* Patient Scheduling */}
                <Route path="/schedule" element={
                  <ProtectedRoute requiredRole="patient">
                    <ErrorBoundary>
                      <Layout>
                        <PatientScheduling />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                } />

                {/* Health Education */}
                <Route path="/education" element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <Layout>
                        <HealthEducation />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                } />

                {/* Telemedicine Dashboard */}
                <Route path="/telemedicine" element={
                  <ProtectedRoute requiredRole="staff">
                    <ErrorBoundary>
                      <Layout>
                        <TelemedicineDashboard />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                } />

                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </SpecialtyProvider>
        </AuthProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;
