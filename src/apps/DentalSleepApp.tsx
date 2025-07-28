import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DentalSleepWrapper } from '@/components/wrappers/DentalSleepWrapper';
import { parseTenantFromUrl } from '@/utils/tenantRouting';

// Dental Sleep specific components
import { DentalSleepDashboard } from '@/components/dental-sleep/DentalSleepDashboard';
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
import EHRIQ from '@/pages/agents/EHRIQ';
import RevenueIQ from '@/pages/agents/RevenueIQ';
import InsuranceIQ from '@/pages/agents/InsuranceIQ';
import InventoryIQ from '@/pages/agents/InventoryIQ';
import EducationIQ from '@/pages/agents/EducationIQ';
import GrowthIQ from '@/pages/agents/GrowthIQ';
import OpsIQ from '@/pages/OpsIQ';
import ApplicationTest from '@/pages/ApplicationTest';

export default function DentalSleepApp() {
  console.log('🦷 [DEBUG] DentalSleepApp: Component function called - rendering starting');
  console.log('🦷 DentalSleepApp: Rendering DentalSleepApp component');
  
  useEffect(() => {
    const tenantRoute = parseTenantFromUrl();
    console.log('🦷 DentalSleepApp: tenantRoute detected:', tenantRoute);
    
    if (tenantRoute?.isProduction) {
      const brandName = tenantRoute.subdomain === 'midwest-dental-sleep' ? 'Midwest Dental Sleep' : 'FlowIQ';
      document.title = brandName;
      console.log('DentalSleepApp: Set production title to:', brandName);
    } else {
      document.title = 'FlowIQ - Dental Sleep';
      console.log('DentalSleepApp: Set development title');
    }
  }, []);

  const tenantRoute = parseTenantFromUrl();
  const isProduction = tenantRoute?.isProduction;
  // Support both dental-sleep-medicine and dental-sleep paths
  const pathPrefix = isProduction ? '' : 
    (window.location.pathname.includes('/dental-sleep-medicine') ? '/dental-sleep-medicine' : '/dental-sleep');
  
  console.log('🦷 DentalSleepApp: Route analysis:', {
    currentPath: window.location.pathname,
    pathPrefix,
    isProduction,
    tenantRoute
  });

  return (
    <DentalSleepWrapper>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to={`${pathPrefix}/dashboard`} replace />} />
        <Route path="/dental-sleep" element={<Navigate to={`${pathPrefix}/dashboard`} replace />} />
        <Route path="/dental-sleep/" element={<Navigate to={`${pathPrefix}/dashboard`} replace />} />
        
        {/* Main Dental Sleep Dashboard */}
        <Route path={`${pathPrefix}/dashboard`} element={
          (() => {
            console.log('🦷 [DEBUG] Dashboard route matched! Rendering ProtectedRoute with path:', `${pathPrefix}/dashboard`);
            return (
              <ProtectedRoute requiredRole="staff">
                <Layout>
                  <DentalSleepDashboard />
                </Layout>
              </ProtectedRoute>
            );
          })()
        } />
        
        <Route path={`${pathPrefix}/calendar`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <Calendar />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Sleep Medicine Specific Features */}
        <Route path={`${pathPrefix}/sleep-studies`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <SleepStudyManager />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path={`${pathPrefix}/dme-tracker`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <DMETracker />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path={`${pathPrefix}/ehr`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <DentalSleepEHR />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path={`${pathPrefix}/templates`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <DentalSleepTemplates />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path={`${pathPrefix}/patient-portal`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <DentalSleepPatientPortal />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path={`${pathPrefix}/insights`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <DentalSleepInsights />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Shared Features */}
        <Route path={`${pathPrefix}/schedule`} element={
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
        
        <Route path={`${pathPrefix}/claims`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <ClaimsDashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path={`${pathPrefix}/patient-management`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <PatientManagement />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path={`${pathPrefix}/team`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <Team />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path={`${pathPrefix}/help`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <Help />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path={`${pathPrefix}/settings`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path={`${pathPrefix}/notifications`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <Notifications />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path={`${pathPrefix}/provider-schedules`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <ProviderSchedules />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* AI Agent Routes */}
        <Route path={`${pathPrefix}/agents/communication`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <CommunicationIQ />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Legacy routes for backwards compatibility */}
        <Route path={`${pathPrefix}/agents/appointment`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <CommunicationIQ />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path={`${pathPrefix}/agents/intake`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <CommunicationIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path={`${pathPrefix}/agents/scribe`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <ScribeIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path={`${pathPrefix}/agents/ehr`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <EHRIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path={`${pathPrefix}/agents/revenue`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <RevenueIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path={`${pathPrefix}/agents/insurance`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <InsuranceIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path={`${pathPrefix}/agents/inventory`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <InventoryIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path={`${pathPrefix}/agents/education`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <EducationIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path={`${pathPrefix}/agents/growth`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <GrowthIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path={`${pathPrefix}/ops`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <OpsIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path={`${pathPrefix}/test`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <ApplicationTest />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Fallback redirect for unmatched routes */}
        <Route path="*" element={<Navigate to={`${pathPrefix}/dashboard`} replace />} />
      </Routes>
    </DentalSleepWrapper>
  );
}