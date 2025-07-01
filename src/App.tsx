
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
// AI Agent imports
import ScheduleIQ from '@/pages/agents/ScheduleIQ';
import IntakeIQ from '@/pages/agents/IntakeIQ';
import RemindIQ from '@/pages/agents/RemindIQ';
import ScribeIQ from '@/pages/agents/ScribeIQ';
import ClaimsIQ from '@/pages/agents/ClaimsIQ';
import BillingIQ from '@/pages/agents/BillingIQ';
import InventoryIQ from '@/pages/agents/InventoryIQ';
import FollowupIQ from '@/pages/agents/FollowupIQ';
import InsightIQ from '@/pages/agents/InsightIQ';
import AssistIQ from '@/pages/agents/AssistIQ';
import EHRIQ from '@/pages/agents/EHRIQ';
import ManagerAgent from '@/pages/ManagerAgent';

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <AuthProvider>
        <SpecialtyProvider>
          <DashboardProvider>
            <AnalyticsProvider>
              <QueryClientProvider client={queryClient}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/auth-testing" element={<AuthTesting />} />
                <Route path="/dental-sleep-demo" element={
                  <TenantWrapper>
                    <DentalSleepDemo />
                  </TenantWrapper>
                } />
                <Route path="/patient-dashboard" element={<PatientDashboard />} />
                <Route path="/dashboard" element={
                  <TenantWrapper>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/financial" element={
                  <TenantWrapper>
                    <Layout>
                      <FinancialManagementPage />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/patient-experience" element={
                  <TenantWrapper>
                    <Layout>
                      <PatientExperiencePage />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/analytics" element={
                  <TenantWrapper>
                    <Layout>
                      <Analytics />
                    </Layout>
                  </TenantWrapper>
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
                  <TenantWrapper>
                    <Layout>
                      <Schedule />
                    </Layout>
                  </TenantWrapper>
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
                <Route path="/manager" element={
                  <TenantWrapper>
                    <Layout>
                      <ManagerAgent />
                    </Layout>
                  </TenantWrapper>
                } />
                {/* AI Agent Routes */}
                <Route path="/agents/schedule" element={
                  <TenantWrapper>
                    <Layout>
                      <ScheduleIQ />
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
                <Route path="/agents/remind" element={
                  <TenantWrapper>
                    <Layout>
                      <RemindIQ />
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
                <Route path="/agents/billing" element={
                  <TenantWrapper>
                    <Layout>
                      <BillingIQ />
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
                <Route path="/agents/followup" element={
                  <TenantWrapper>
                    <Layout>
                      <FollowupIQ />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/agents/insight" element={
                  <TenantWrapper>
                    <Layout>
                      <InsightIQ />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/agents/assist" element={
                  <TenantWrapper>
                    <Layout>
                      <AssistIQ />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/agents/ehr" element={
                  <TenantWrapper>
                    <Layout>
                      <EHRIQ />
                    </Layout>
                  </TenantWrapper>
                } />
                <Route path="/settings" element={
                  <TenantWrapper>
                    <Layout>
                      <Settings />
                    </Layout>
                  </TenantWrapper>
                } />
                {/* Fallback route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </QueryClientProvider>
          </AnalyticsProvider>
        </DashboardProvider>
      </SpecialtyProvider>
    </AuthProvider>
    </Router>
  );
}

export default App;
