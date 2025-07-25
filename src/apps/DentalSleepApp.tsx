import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DentalSleepWrapper } from '@/components/wrappers/DentalSleepWrapper';
import { parseTenantFromUrl } from '@/utils/tenantRouting';

// Dental Sleep specific components
import { DentalSleepDashboard } from '@/components/specialty/dashboards/DentalSleepDashboard';
import { DentalSleepTemplates } from '@/components/specialty/DentalSleepTemplates';
import { DentalSleepEHR } from '@/components/ehr/specialty/DentalSleepEHR';
import { DentalSleepPatientPortal } from '@/components/patient-experience/DentalSleepPatientPortal';
import { SleepStudyManager } from '@/components/dental-sleep/SleepStudyManager';
import { DMETracker } from '@/components/dental-sleep/DMETracker';

// Shared components
import { Calendar } from '@/pages/Calendar';
import { ClaimsDashboard } from '@/components/claims/ClaimsDashboard';
import { ScheduleDashboard } from '@/components/schedule/ScheduleDashboard';
import PatientManagement from '@/pages/PatientManagement';
import Team from '@/pages/Team';
import Help from '@/pages/Help';
import Settings from '@/pages/Settings';
import Notifications from '@/pages/Notifications';
import ProviderSchedules from '@/pages/ProviderSchedules';
import DentalSleepInsights from '@/components/specialty/insights/DentalSleepInsights';

// AI Agents that apply to dental sleep
import CommunicationIQ from '@/pages/agents/CommunicationIQ';
import ScribeIQ from '@/pages/agents/ScribeIQ';
import ClaimsIQ from '@/pages/agents/ClaimsIQ';
import PaymentsIQ from '@/pages/agents/PaymentsIQ';
import AuthIQ from '@/pages/agents/AuthIQ';
import EducationIQ from '@/pages/agents/EducationIQ';
import MarketingIQ from '@/pages/agents/MarketingIQ';
import GoToMarketIQ from '@/pages/agents/GoToMarketIQ';
import ReferralIQ from '@/pages/agents/ReferralIQ';
import OpsIQ from '@/pages/OpsIQ';
import ApplicationTest from '@/pages/ApplicationTest';

export default function DentalSleepApp() {
  useEffect(() => {
    const tenantRoute = parseTenantFromUrl();
    if (tenantRoute?.isProduction) {
      const brandName = tenantRoute.subdomain === 'midwest-dental-sleep' ? 'Midwest Dental Sleep' : 'FlowIQ';
      document.title = brandName;
    } else {
      document.title = 'FlowIQ - Dental Sleep';
    }
  }, []);

  return (
    <DentalSleepWrapper>
      <Routes>
        {/* Redirect /dental-sleep to dashboard */}
        <Route path="/dental-sleep" element={<Navigate to="/dental-sleep/dashboard" replace />} />
        <Route path="/dental-sleep/" element={<Navigate to="/dental-sleep/dashboard" replace />} />
        
        {/* Main Dental Sleep Dashboard */}
        <Route path="/dental-sleep/dashboard" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <DentalSleepDashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/dental-sleep/calendar" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <Calendar />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Sleep Medicine Specific Features */}
        <Route path="/dental-sleep/sleep-studies" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <SleepStudyManager />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/dental-sleep/dme-tracker" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <DMETracker />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/dental-sleep/ehr" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <DentalSleepEHR />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/dental-sleep/templates" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <DentalSleepTemplates />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/dental-sleep/patient-portal" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <DentalSleepPatientPortal />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/dental-sleep/insights" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <DentalSleepInsights />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Shared Features */}
        <Route path="/dental-sleep/schedule" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <ScheduleDashboard 
                recentActivity={[
                  { time: "2 hours ago", action: "Sleep consultation scheduled for John Smith", type: "appointment" },
                  { time: "4 hours ago", action: "DME authorization approved for Sarah Johnson", type: "authorization" },
                  { time: "Yesterday", action: "Follow-up call completed with Mike Wilson", type: "follow-up" },
                  { time: "Yesterday", action: "Sleep study results reviewed for Emma Davis", type: "study" },
                  { time: "2 days ago", action: "CPAP delivery confirmed for Robert Brown", type: "delivery" }
                ]} 
                upcomingTasks={[
                  { task: "Review sleep study results for 3 patients", priority: "high", eta: "Today 2:00 PM" },
                  { task: "Follow-up call with pending DME patients", priority: "medium", eta: "Tomorrow 10:00 AM" },
                  { task: "Submit insurance authorizations batch", priority: "medium", eta: "Tomorrow 3:00 PM" },
                  { task: "Schedule compliance check appointments", priority: "low", eta: "This week" },
                  { task: "Update patient education materials", priority: "low", eta: "Next week" }
                ]} 
              />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/dental-sleep/claims" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <ClaimsDashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/dental-sleep/patient-management" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <PatientManagement />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/dental-sleep/team" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <Team />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/dental-sleep/help" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <Help />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/dental-sleep/settings" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/dental-sleep/notifications" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <Notifications />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/dental-sleep/provider-schedules" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <ProviderSchedules />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* AI Agent Routes */}
        <Route path="/dental-sleep/agents/communication" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <CommunicationIQ />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Legacy routes for backwards compatibility */}
        <Route path="/dental-sleep/agents/appointment" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <CommunicationIQ />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/dental-sleep/agents/intake" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <CommunicationIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/dental-sleep/agents/go-to-market" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <GoToMarketIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/dental-sleep/agents/scribe" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <ScribeIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/dental-sleep/agents/claims" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <ClaimsIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/dental-sleep/agents/payments" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <PaymentsIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/dental-sleep/agents/education" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <EducationIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/dental-sleep/agents/marketing" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <MarketingIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/dental-sleep/agents/referral" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <ReferralIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/dental-sleep/agents/auth" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <AuthIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/dental-sleep/ops" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <OpsIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/dental-sleep/test" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <ApplicationTest />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </DentalSleepWrapper>
  );
}