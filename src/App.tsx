
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import Index from './pages/Index';
import Schedule from './pages/Schedule';
import Analytics from './pages/Analytics';
import EHR from './pages/EHR';
import Settings from './pages/Settings';
import { AuthProvider } from './contexts/AuthProvider';
import { DashboardProvider } from './contexts/DashboardContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdvancedAnalytics } from '@/pages/AdvancedAnalytics';
import { ComplianceSecurityPage } from '@/pages/ComplianceSecurityPage';
import { AnalyticsProvider } from '@/contexts/AnalyticsContext';
import { PatientPortal } from '@/pages/PatientPortal';
import { ProviderMobile } from '@/pages/ProviderMobile';
import { CompleteIntakeFlow } from '@/components/intake/CompleteIntakeFlow';
import { BookingWidgetDemo } from '@/pages/BookingWidgetDemo';
import { PatientPrepPage } from '@/pages/PatientPrepPage';
import { TenantWrapper } from '@/components/wrappers';
import { AuthPage } from '@/components/auth/AuthPage';
import { PatientDashboard } from '@/pages/PatientDashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <AuthProvider>
        <DashboardProvider>
          <AnalyticsProvider>
            <QueryClientProvider client={queryClient}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/patient-dashboard" element={<PatientDashboard />} />
                <Route path="/dashboard" element={
                  <TenantWrapper>
                    <Dashboard />
                  </TenantWrapper>
                } />
                <Route path="/analytics" element={
                  <TenantWrapper>
                    <Analytics />
                  </TenantWrapper>
                } />
                <Route path="/advanced-analytics" element={
                  <TenantWrapper>
                    <AdvancedAnalytics />
                  </TenantWrapper>
                } />
                <Route path="/compliance" element={
                  <TenantWrapper>
                    <ComplianceSecurityPage />
                  </TenantWrapper>
                } />
                <Route path="/patient-portal" element={<PatientPortal />} />
                <Route path="/provider-mobile" element={
                  <TenantWrapper>
                    <ProviderMobile />
                  </TenantWrapper>
                } />
                <Route path="/provider/patient-prep/:appointmentId" element={
                  <TenantWrapper>
                    <PatientPrepPage />
                  </TenantWrapper>
                } />
                <Route path="/complete-intake" element={<CompleteIntakeFlow />} />
                <Route path="/booking-widget" element={<BookingWidgetDemo />} />
                <Route path="/schedule" element={
                  <TenantWrapper>
                    <Schedule />
                  </TenantWrapper>
                } />
                <Route path="/ehr" element={
                  <TenantWrapper>
                    <EHR />
                  </TenantWrapper>
                } />
                <Route path="/settings" element={
                  <TenantWrapper>
                    <Settings />
                  </TenantWrapper>
                } />
              </Routes>
            </QueryClientProvider>
          </AnalyticsProvider>
        </DashboardProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
