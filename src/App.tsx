
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
import { TenantWrapper, DentalSleepWrapper, ChiropracticWrapper } from '@/components/wrappers';
import AuthPage from '@/pages/AuthPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PatientDashboard } from '@/pages/PatientDashboard';
import AuthTesting from '@/pages/AuthTesting';
import DentalSleepDemo from '@/pages/DentalSleepDemo';
import { FinancialManagementPage } from '@/pages/FinancialManagementPage';
import { PatientExperiencePage } from '@/pages/PatientExperiencePage';
import PatientIntakeForm from '@/pages/PatientIntakeForm';
import { EmbeddedPortal } from '@/pages/EmbeddedPortal';
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
import MarketingIQ from '@/pages/agents/MarketingIQ';
import RemindIQ from '@/pages/agents/RemindIQ';
import ReferralIQ from '@/pages/agents/ReferralIQ';
import PilotDashboard from '@/pages/PilotDashboard';
import ExternalIntegrationsPage from '@/pages/ExternalIntegrations';
import BookingWidgetPage from '@/pages/BookingWidget';
import PlatformAdmin from '@/pages/PlatformAdmin';
import TenantOnboarding from '@/pages/TenantOnboarding';
import PracticeSetup from '@/pages/PracticeSetup';
// Demo imports
import { DemoHub } from '@/pages/demo/DemoHub';
import { DemoChiropractic } from '@/pages/demo/DemoChiropractic';
import { DemoDental } from '@/pages/demo/DemoDental';
import { DemoMedSpa } from '@/pages/demo/DemoMedSpa';
import PatientNotifications from '@/pages/PatientNotifications';
import PatientSettings from '@/pages/PatientSettings';
import PatientMessages from '@/pages/PatientMessages';
import PatientJourney from '@/pages/PatientJourney';
import ResetPassword from '@/pages/ResetPassword';

import { Toaster } from '@/components/ui/toaster';

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
                <Route path="/get-started" element={<AuthPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/reset-password" element={<ResetPassword />} />
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
                <Route path="/patient-journey" element={
                  <ProtectedRoute>
                    <PatientJourney />
                  </ProtectedRoute>
                } />
                <Route path="/patient/notifications" element={
                  <ProtectedRoute>
                    <PatientNotifications />
                  </ProtectedRoute>
                } />
                <Route path="/patient/settings" element={
                  <ProtectedRoute>
                    <PatientSettings />
                  </ProtectedRoute>
                } />
                <Route path="/patient/messages" element={
                  <ProtectedRoute>
                    <PatientMessages />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute requiredRole="staff">
                    <ChiropracticWrapper>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ChiropracticWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/financial" element={
                  <ProtectedRoute requiredRole="staff">
                    <ChiropracticWrapper>
                      <Layout>
                        <FinancialManagementPage />
                      </Layout>
                    </ChiropracticWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/patient-experience" element={
                  <ProtectedRoute requiredRole="staff">
                    <ChiropracticWrapper>
                      <Layout>
                        <PatientExperiencePage />
                      </Layout>
                    </ChiropracticWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                  <ProtectedRoute requiredRole="staff">
                    <ChiropracticWrapper>
                      <Layout>
                        <Analytics />
                      </Layout>
                    </ChiropracticWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/advanced-analytics" element={
                  <ChiropracticWrapper>
                    <Layout>
                      <AdvancedAnalytics />
                    </Layout>
                  </ChiropracticWrapper>
                } />
                <Route path="/compliance" element={
                  <ChiropracticWrapper>
                    <Layout>
                      <ComplianceSecurityPage />
                    </Layout>
                  </ChiropracticWrapper>
                } />
                <Route path="/patient-portal" element={<PatientPortal />} />
                <Route path="/patient-intake/:formId" element={<PatientIntakeForm />} />
                <Route path="/embedded-portal" element={<EmbeddedPortal />} />
                <Route path="/provider-mobile" element={
                  <ChiropracticWrapper>
                    <Layout>
                      <ProviderMobile />
                    </Layout>
                  </ChiropracticWrapper>
                } />
                <Route path="/provider/patient-prep/:appointmentId" element={
                  <ChiropracticWrapper>
                    <Layout>
                      <PatientPrepPage />
                    </Layout>
                  </ChiropracticWrapper>
                } />
                <Route path="/complete-intake" element={<CompleteIntakeFlow />} />
                <Route path="/booking-widget" element={<BookingWidgetDemo />} />
                <Route path="/schedule" element={
                  <ProtectedRoute requiredRole="staff">
                    <ChiropracticWrapper>
                      <Layout>
                        <Schedule />
                      </Layout>
                    </ChiropracticWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/ehr" element={
                  <ChiropracticWrapper>
                    <Layout>
                      <EHR />
                    </Layout>
                  </ChiropracticWrapper>
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
                  <ChiropracticWrapper>
                    <Layout>
                      <AppointmentIQ />
                    </Layout>
                  </ChiropracticWrapper>
                } />
                <Route path="/agents/intake" element={
                  <ChiropracticWrapper>
                    <Layout>
                      <IntakeIQ />
                    </Layout>
                  </ChiropracticWrapper>
                } />
                <Route path="/agents/scribe" element={
                  <ChiropracticWrapper>
                    <Layout>
                      <ScribeIQ />
                    </Layout>
                  </ChiropracticWrapper>
                } />
                <Route path="/agents/claims" element={
                  <ChiropracticWrapper>
                    <Layout>
                      <ClaimsIQ />
                    </Layout>
                  </ChiropracticWrapper>
                } />
                <Route path="/agents/referral" element={
                  <ChiropracticWrapper>
                    <Layout>
                      <ReferralIQ />
                    </Layout>
                  </ChiropracticWrapper>
                } />
                <Route path="/agents/payments" element={
                  <ChiropracticWrapper>
                    <Layout>
                      <PaymentsIQ />
                    </Layout>
                  </ChiropracticWrapper>
                } />
                <Route path="/agents/inventory" element={
                  <ChiropracticWrapper>
                    <Layout>
                      <InventoryIQ />
                    </Layout>
                  </ChiropracticWrapper>
                } />
                <Route path="/agents/insights" element={
                  <ChiropracticWrapper>
                    <Layout>
                      <InsightIQ />
                    </Layout>
                  </ChiropracticWrapper>
                } />
                <Route path="/agents/education" element={
                  <ChiropracticWrapper>
                    <Layout>
                      <EducationIQ />
                    </Layout>
                  </ChiropracticWrapper>
                } />
                <Route path="/agents/marketing" element={
                  <ChiropracticWrapper>
                    <Layout>
                      <MarketingIQ />
                    </Layout>
                  </ChiropracticWrapper>
                } />
                <Route path="/agents/remind" element={
                  <ChiropracticWrapper>
                    <Layout>
                      <RemindIQ />
                    </Layout>
                  </ChiropracticWrapper>
                } />
                <Route path="/agents/auth" element={
                  <ChiropracticWrapper>
                    <Layout>
                      <AuthIQ />
                    </Layout>
                  </ChiropracticWrapper>
                } />
                <Route path="/integrations" element={
                  <ChiropracticWrapper>
                    <Layout>
                      <ExternalIntegrationsPage />
                    </Layout>
                  </ChiropracticWrapper>
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
                <Route path="/practice-setup" element={
                  <ProtectedRoute>
                    <PracticeSetup />
                  </ProtectedRoute>
                } />
                {/* Demo Routes - Public Access */}
                <Route path="/demo" element={<DemoHub />} />
                <Route path="/demo/chiropractic" element={<DemoChiropractic />} />
                <Route path="/demo/dental" element={<DemoDental />} />
                <Route path="/demo/medspa" element={<DemoMedSpa />} />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <ChiropracticWrapper>
                      <Layout>
                        <Settings />
                      </Layout>
                    </ChiropracticWrapper>
                  </ProtectedRoute>
                } />
                {/* Fallback route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              </AnalyticsProvider>
            </DashboardProvider>
          </SpecialtyProvider>
        </QueryClientProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
