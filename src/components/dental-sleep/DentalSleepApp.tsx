import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DentalSleepWrapper } from '@/components/wrappers/DentalSleepWrapper';
import { parseTenantFromUrl } from '@/utils/tenantRouting';

// Dental Sleep Pages
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

// Dental Sleep Specific Components
import { SleepStudyManager } from '@/components/dental-sleep/SleepStudyManager';
import { DMETracker } from '@/components/dental-sleep/DMETracker';
import { DentalSleepDashboard } from '@/components/dental-sleep/DentalSleepDashboard';

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

export const DentalSleepApp: React.FC = () => {
  console.log('🦷 DentalSleepApp: Rendering DentalSleepApp component');
  
  useEffect(() => {
    const tenantRoute = parseTenantFromUrl();
    console.log('🦷 DentalSleepApp: tenantRoute detected:', tenantRoute);
    
    if (tenantRoute?.isProduction) {
      const brandName = tenantRoute.subdomain === 'midwest-dental-sleep' ? 'Midwest Dental Sleep Medicine' : 'FlowIQ';
      document.title = brandName;
      console.log('🦷 DentalSleepApp: Set title to:', brandName);
    } else {
      // Check if we're on a dental-sleep route in development
      if (window.location.pathname.includes('/dental-sleep')) {
        document.title = 'FlowIQ - Dental Sleep Medicine';
      } else {
        document.title = 'Midwest Dental Sleep Medicine'; // Default for midwest-dental-sleep domain
      }
      console.log('🦷 DentalSleepApp: Set development title to:', document.title);
    }
  }, []);

  const tenantRoute = parseTenantFromUrl();
  const isProduction = tenantRoute?.isProduction;
  const pathPrefix = isProduction ? '' : '/dental-sleep';
  
  // Support non-prefixed routes for fallback routing from TenantRouter
  const currentPath = window.location.pathname;
  const isNonPrefixedRoute = !currentPath.startsWith('/dental-sleep') && !isProduction;
  
  console.log('🦷 DentalSleepApp: Route analysis:', {
    currentPath,
    pathPrefix,
    isProduction,
    isNonPrefixedRoute,
    tenantRoute
  });

  console.log('🦷 DentalSleepApp: About to render DentalSleepWrapper with Routes');
  
  return (
    <DentalSleepWrapper>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to={`${pathPrefix}/dashboard`} replace />} />
        <Route path="/dental-sleep" element={<Navigate to={`${pathPrefix}/dashboard`} replace />} />
        
        {/* Main Dental Sleep Pages */}
        <Route path={`${pathPrefix}/dashboard`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <DentalSleepDashboard />
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
        
        {/* Dental Sleep Specific Routes */}
        <Route path={`${pathPrefix}/sleep-studies`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <SleepStudyManager />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path={`${pathPrefix}/dme-tracking`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <DMETracker />
            </Layout>
          </ProtectedRoute>
        } />
        
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
        
        <Route path={`${pathPrefix}/agents/ops`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <OpsIQ />
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
        
        {/* Development/Testing Routes */}
        <Route path={`${pathPrefix}/test`} element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <ApplicationTest />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Development: Test route without authentication */}
        {process.env.NODE_ENV === 'development' && (
          <Route path={`${pathPrefix}/test-no-auth`} element={
            <Layout>
              <DentalSleepDashboard />
            </Layout>
          </Route>
        )}
        
        {/* Development: Simple test route */}
        {process.env.NODE_ENV === 'development' && (
          <Route path={`${pathPrefix}/test-simple`} element={
            <Layout>
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Simple Test Dashboard</h1>
                <p>This is a simple test to see if the sidebar appears.</p>
                <div className="mt-4 p-4 bg-blue-100 rounded">
                  <h2 className="font-semibold">Debug Info:</h2>
                  <p>URL: {window.location.href}</p>
                  <p>Path: {window.location.pathname}</p>
                  <p>Hostname: {window.location.hostname}</p>
                </div>
              </div>
            </Layout>
          </Route>
        )}
        
        {/* Catch-all route for non-prefixed routes */}
        {isNonPrefixedRoute && (
          <Route path="/*" element={<Navigate to={`${pathPrefix}/dashboard`} replace />} />
        )}
      </Routes>
    </DentalSleepWrapper>
  );
};