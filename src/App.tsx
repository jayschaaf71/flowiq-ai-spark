
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
import { SpecialtyProvider } from './contexts/SpecialtyContext';
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
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PatientDashboard } from '@/pages/PatientDashboard';
import AuthTesting from '@/pages/AuthTesting';
import DentalSleepDemo from '@/pages/DentalSleepDemo';
import { FinancialManagementPage } from '@/pages/FinancialManagementPage';
import { PatientExperiencePage } from '@/pages/PatientExperiencePage';
import { Layout } from '@/components/Layout';
import PatientManagement from '@/pages/PatientManagement';
import NotFound from '@/pages/NotFound';
import Team from '@/pages/Team';
import Help from '@/pages/Help';
import Insights from '@/pages/Insights';
import Notifications from '@/pages/Notifications';
import CheckIn from '@/pages/CheckIn';
import ProviderSchedulingPage from '@/pages/ProviderScheduling';
// AI Agent imports
import AppointmentIQ from '@/pages/agents/AppointmentIQ';
import IntakeIQ from '@/pages/agents/IntakeIQ';
import ScribeIQ from '@/pages/agents/ScribeIQ';
import ClaimsIQ from '@/pages/agents/ClaimsIQ';
import PaymentsIQ from '@/pages/agents/PaymentsIQ';
import InventoryIQ from '@/pages/agents/InventoryIQ';
import InsightIQ from '@/pages/agents/InsightIQ';
import OpsIQ from '@/pages/agents/OpsIQ';
import AuthIQ from '@/pages/agents/AuthIQ';
import EducationIQ from '@/pages/agents/EducationIQ';
import ReferralIQ from '@/pages/agents/ReferralIQ';
import PilotDashboard from '@/pages/PilotDashboard';
import ExternalIntegrationsPage from '@/pages/ExternalIntegrations';
import BookingWidgetPage from '@/pages/BookingWidget';
import PlatformAdmin from '@/pages/PlatformAdmin';
import TenantOnboarding from '@/pages/TenantOnboarding';
import PracticeSetup from '@/pages/PracticeSetup';

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <SpecialtyProvider>
            <DashboardProvider>
              <AnalyticsProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/auth-testing" element={<AuthTesting />} />
                <Route path="/dental-sleep-demo" element={
                  <TenantWrapper>
                    <DentalSleepDemo />
                  </TenantWrapper>
                } />
                <Route path="/patient-dashboard" element={
                  <ProtectedRoute>
                    <PatientDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute requiredRole="staff">
                    <TenantWrapper>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </TenantWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/financial" element={
                  <ProtectedRoute requiredRole="staff">
                    <TenantWrapper>
                      <Layout>
                        <FinancialManagementPage />
                      </Layout>
                    </TenantWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/patient-experience" element={
                  <ProtectedRoute requiredRole="staff">
                    <TenantWrapper>
                      <Layout>
                        <PatientExperiencePage />
                      </Layout>
                    </TenantWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                  <ProtectedRoute requiredRole="staff">
                    <TenantWrapper>
                      <Layout>
                        <Analytics />
                      </Layout>
                    </TenantWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/advanced-analytics" element={
                  <TenantWrapper>
                    <Layout>
                      <AdvancedAnalytics />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/compliance" element={
                  <TenantWrapper>
                    <Layout>
                      <ComplianceSecurityPage />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/patient-portal" element={<PatientPortal />} />
                <Route path="/provider-mobile" element={
                  <TenantWrapper>
                    <Layout>
                      <ProviderMobile />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/provider/patient-prep/:appointmentId" element={
                  <TenantWrapper>
                    <Layout>
                      <PatientPrepPage />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/complete-intake" element={<CompleteIntakeFlow />} />
                <Route path="/booking-widget" element={<BookingWidgetDemo />} />
                <Route path="/schedule" element={
                  <ProtectedRoute requiredRole="staff">
                    <TenantWrapper>
                      <Layout>
                        <Schedule />
                      </Layout>
                    </TenantWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/ehr" element={
                  <TenantWrapper>
                    <Layout>
                      <EHR />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/patient-management" element={
                  <TenantWrapper>
                    <Layout>
                      <PatientManagement />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/insights" element={
                  <TenantWrapper>
                    <Layout>
                      <Insights />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/notifications" element={
                  <TenantWrapper>
                    <Layout>
                      <Notifications />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/team" element={
                  <TenantWrapper>
                    <Layout>
                      <Team />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/help" element={
                  <TenantWrapper>
                    <Layout>
                      <Help />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/checkin" element={
                  <TenantWrapper>
                    <Layout>
                      <CheckIn />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/provider-scheduling" element={
                  <TenantWrapper>
                    <Layout>
                      <ProviderSchedulingPage />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/ops" element={
                  <TenantWrapper>
                    <Layout>
                      <OpsIQ />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/pilot" element={
                  <TenantWrapper>
                    <Layout>
                      <PilotDashboard />
                    </Layout>
                  </TenantWrapper>
                } />
                {/* AI Agent Routes */}
                <Route path="/agents/appointment" element={
                  <TenantWrapper>
                    <Layout>
                      <AppointmentIQ />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/agents/intake" element={
                  <TenantWrapper>
                    <Layout>
                      <IntakeIQ />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/agents/scribe" element={
                  <TenantWrapper>
                    <Layout>
                      <ScribeIQ />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/agents/claims" element={
                  <TenantWrapper>
                    <Layout>
                      <ClaimsIQ />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/agents/auth" element={
                  <TenantWrapper>
                    <Layout>
                      <AuthIQ />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/agents/education" element={
                  <TenantWrapper>
                    <Layout>
                      <EducationIQ />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/agents/referral" element={
                  <TenantWrapper>
                    <Layout>
                      <ReferralIQ />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/agents/payments" element={
                  <TenantWrapper>
                    <Layout>
                      <PaymentsIQ />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/agents/inventory" element={
                  <TenantWrapper>
                    <Layout>
                      <InventoryIQ />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/agents/insights" element={
                  <TenantWrapper>
                    <Layout>
                      <InsightIQ />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/integrations" element={
                  <TenantWrapper>
                    <Layout>
                      <ExternalIntegrationsPage />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/widget" element={<BookingWidgetPage />} />
                <Route path="/platform-admin" element={
                  <ProtectedRoute requiredRole="admin">
                    <PlatformAdmin />
                  </ProtectedRoute>
                } />
                <Route path="/onboarding/:tenantId" element={
                  <ProtectedRoute>
                    <TenantOnboarding />
                  </ProtectedRoute>
                } />
                <Route path="/onboarding" element={
                  <ProtectedRoute>
                    <TenantOnboarding />
                  </ProtectedRoute>
                } />
                <Route path="/setup" element={
                  <ProtectedRoute>
                    <PracticeSetup />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <TenantWrapper>
                      <Layout>
                        <Settings />
                      </Layout>
                    </TenantWrapper>
                  </ProtectedRoute>
                } />
                {/* Fallback route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              </AnalyticsProvider>
            </DashboardProvider>
          </SpecialtyProvider>
        </QueryClientProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
