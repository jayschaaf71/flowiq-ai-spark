import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ChiropracticWrapper } from '@/components/wrappers/ChiropracticWrapper';
import { parseTenantFromUrl } from '@/utils/tenantRouting';

// Chiropractic Pages
import { Dashboard } from '@/pages/Dashboard';
import { Calendar } from '@/pages/Calendar';
import Schedule from '@/pages/Schedule';
import Analytics from '@/pages/Analytics';
import EHR from '@/pages/EHR';
import Settings from '@/pages/Settings';
import PatientManagement from '@/pages/PatientManagement';
import Team from '@/pages/Team';
import Help from '@/pages/Help';
import Insights from '@/pages/Insights';
import Notifications from '@/pages/Notifications';
import CheckIn from '@/pages/CheckIn';
import { FinancialManagementPage } from '@/pages/FinancialManagementPage';
import { PatientExperiencePage } from '@/pages/PatientExperiencePage';
import { AIAutomationHub } from '@/pages/AIAutomationHub';

// Chiropractic Specific Components
import { ChiropracticDashboard } from '@/components/chiropractic/ChiropracticDashboard';

// AI Agents
import CommunicationIQ from '@/pages/agents/CommunicationIQ';
import ScribeIQ from '@/pages/agents/ScribeIQ';
import EHRIQ from '@/pages/agents/EHRIQ';
import RevenueIQ from '@/pages/agents/RevenueIQ';
import InsuranceIQ from '@/pages/agents/InsuranceIQ';
import InventoryIQ from '@/pages/agents/InventoryIQ';
import InsightIQ from '@/pages/agents/InsightIQ';
import OpsIQ from '@/pages/agents/OpsIQ';
import EducationIQ from '@/pages/agents/EducationIQ';
import GrowthIQ from '@/pages/agents/GrowthIQ';
import ApplicationTest from '@/pages/ApplicationTest';

export default function ChiropracticApp() {
  console.log('🦴 ChiropracticApp: Rendering ChiropracticApp component');

  useEffect(() => {
    const tenantRoute = parseTenantFromUrl();
    console.log('🦴 ChiropracticApp: tenantRoute detected:', tenantRoute);

    if (tenantRoute?.isProduction) {
      const brandName = tenantRoute.subdomain === 'west-county-spine' ? 'West County Spine & Joint' : 'FlowIQ';
      document.title = brandName;
      console.log('🦴 ChiropracticApp: Set title to:', brandName);
    } else {
      // Check if we're on a chiropractic route in development
      if (window.location.pathname.includes('/chiropractic')) {
        document.title = 'FlowIQ - Chiropractic';
      } else {
        document.title = 'West County Spine & Joint'; // Default for west-county-spine domain
      }
      console.log('🦴 ChiropracticApp: Set development title to:', document.title);
    }
  }, []);

  const tenantRoute = parseTenantFromUrl();
  const isProduction = tenantRoute?.isProduction;
  const pathPrefix = isProduction ? '' : '/chiropractic';

  // Support non-prefixed routes for fallback routing from TenantRouter
  const currentPath = window.location.pathname;
  const isNonPrefixedRoute = !currentPath.startsWith('/chiropractic') && !isProduction;

  console.log('🦴 ChiropracticApp: Route analysis:', {
    currentPath,
    pathPrefix,
    isProduction,
    isNonPrefixedRoute,
    tenantRoute
  });

  console.log('🦴 ChiropracticApp: About to render ChiropracticWrapper with Routes');

  return (
    <ChiropracticWrapper>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to={`${pathPrefix}/dashboard`} replace />} />
        <Route path="/chiropractic" element={<Navigate to={`${pathPrefix}/dashboard`} replace />} />

        {/* Main Chiropractic Pages */}
        <Route path={`${pathPrefix}/dashboard`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <ChiropracticDashboard />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path={`${pathPrefix}/calendar`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <Calendar />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path={`${pathPrefix}/schedule`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <Schedule />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path={`${pathPrefix}/analytics`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <Analytics />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path={`${pathPrefix}/ehr`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <EHR />
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

        <Route path={`${pathPrefix}/financial`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <FinancialManagementPage />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path={`${pathPrefix}/patient-experience`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <PatientExperiencePage />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path={`${pathPrefix}/ai-automation`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <AIAutomationHub />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path={`${pathPrefix}/checkin`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <CheckIn />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path={`${pathPrefix}/insights`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <Insights />
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

        {/* Chiropractic Specific Routes */}
        {/* Temporarily removed - components not implemented yet */}

        {/* AI Agents */}
        <Route path={`${pathPrefix}/agents/communication`} element={
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

        <Route path={`${pathPrefix}/agents/insight`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <InsightIQ />
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

        <Route path={`${pathPrefix}/agents/ops`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <OpsIQ />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Development/Testing Routes */}
        <Route path={`${pathPrefix}/test`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <ApplicationTest />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Development: Test route without authentication */}
        {/* Temporarily commented out to fix build issue */}
        {/* {process.env.NODE_ENV === 'development' && (
          <Route path="/chiropractic/test-no-auth" element={
            <Layout>
              <Dashboard />
            </Layout>
          </Route>
        )} */}

        {/* Catch-all route for all unmatched routes */}
        <Route path="*" element={<Navigate to={`${pathPrefix}/dashboard`} replace />} />
      </Routes>
    </ChiropracticWrapper>
  );
} 