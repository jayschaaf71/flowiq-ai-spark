import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthProvider';

// Core Pages
import Index from '@/pages/Index';
import AuthPage from '@/pages/AuthPage';
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/Settings';
import ProfilePage from '@/pages/ProfilePage';
import PatientPortal from '@/pages/PatientPortal';
import ProviderPortal from '@/pages/ProviderPortal';

// Onboarding & Forms
import EnhancedOnboarding from '@/pages/EnhancedOnboarding';
import PatientOnboarding from '@/pages/PatientOnboarding';
import IntakeForm from '@/pages/IntakeForm';

// Specialty Routes
import ChiropracticRoutes from '@/routes/ChiropracticRoutes';
import DentalSleepRoutes from '@/routes/DentalSleepRoutes';

// Feature Routes
import EHRRoutes from '@/routes/EHRRoutes';
import BillingRoutes from '@/routes/BillingRoutes';
import CalendarRoutes from '@/routes/CalendarRoutes';
import AnalyticsRoutes from '@/routes/AnalyticsRoutes';
import VoiceCallRoutes from '@/routes/VoiceCallRoutes';
import IntegrationRoutes from '@/routes/IntegrationRoutes';
import CommunicationRoutes from '@/routes/CommunicationRoutes';

// Admin & Platform
import PlatformAdmin from '@/pages/PlatformAdmin';
import ProviderMobileInterface from '@/pages/ProviderMobileInterface';
import BookingWidgetPage from '@/pages/BookingWidgetPage';

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

function QueryClient({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}

function App() {
  return (
    <QueryClient>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Tenant-specific routes */}
            <Route path="/chiropractic/*" element={<ChiropracticRoutes />} />
            <Route path="/dental-sleep/*" element={<DentalSleepRoutes />} />
            
            {/* Patient Portal */}
            <Route path="/patient-portal" element={
              <ProtectedRoute requiredRole="patient">
                <PatientPortal />
              </ProtectedRoute>
            } />
            
            {/* Provider Portal */}
            <Route path="/provider-portal" element={
              <ProtectedRoute requiredRole="staff">
                <ProviderPortal />
              </ProtectedRoute>
            } />

            {/* Enhanced Onboarding */}
            <Route path="/enhanced-onboarding" element={<EnhancedOnboarding />} />
            <Route path="/patient-onboarding" element={<PatientOnboarding />} />

            {/* Intake Forms */}
            <Route path="/intake/:formId" element={<IntakeForm />} />

            {/* Settings and Profile */}
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            {/* Provider Mobile Interface */}
            <Route path="/provider-mobile" element={
              <ProtectedRoute requiredRole="staff">
                <ProviderMobileInterface />
              </ProtectedRoute>
            } />

            {/* EHR Routes */}
            <Route path="/ehr/*" element={
              <ProtectedRoute requiredRole="staff">
                <EHRRoutes />
              </ProtectedRoute>
            } />

            {/* Billing Routes */}
            <Route path="/billing/*" element={
              <ProtectedRoute requiredRole="staff">
                <BillingRoutes />
              </ProtectedRoute>
            } />

            {/* Calendar Routes */}
            <Route path="/calendar/*" element={
              <ProtectedRoute requiredRole="staff">
                <CalendarRoutes />
              </ProtectedRoute>
            } />

            {/* Analytics Routes */}
            <Route path="/analytics/*" element={
              <ProtectedRoute requiredRole="staff">
                <AnalyticsRoutes />
              </ProtectedRoute>
            } />

            {/* Voice Call Routes */}
            <Route path="/voice-calls/*" element={
              <ProtectedRoute requiredRole="staff">
                <VoiceCallRoutes />
              </ProtectedRoute>
            } />

            {/* Integration Routes */}
            <Route path="/integrations/*" element={
              <ProtectedRoute requiredRole="staff">
                <IntegrationRoutes />
              </ProtectedRoute>
            } />

            {/* Communication Routes */}
            <Route path="/communication/*" element={
              <ProtectedRoute requiredRole="staff">
                <CommunicationRoutes />
              </ProtectedRoute>
            } />

            {/* Booking Widget */}
            <Route path="/widget" element={<BookingWidgetPage />} />

            {/* Platform Administration */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="platform_admin">
                <PlatformAdmin />
              </ProtectedRoute>
            } />
            <Route path="/platform-admin/*" element={
              <ProtectedRoute requiredRole="platform_admin">
                <PlatformAdmin />
              </ProtectedRoute>
            } />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClient>
  );
}

export default App;
