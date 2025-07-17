import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DentalWrapper } from '@/components/wrappers/DentalWrapper';

// Dental Pages
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

// AI Agents
import CommunicationIQ from '@/pages/agents/CommunicationIQ';
import ScribeIQ from '@/pages/agents/ScribeIQ';
import ClaimsIQ from '@/pages/agents/ClaimsIQ';
import PaymentsIQ from '@/pages/agents/PaymentsIQ';
import InventoryIQ from '@/pages/agents/InventoryIQ';
import InsightIQ from '@/pages/agents/InsightIQ';
import OpsIQ from '@/pages/agents/OpsIQ';
import AuthIQ from '@/pages/agents/AuthIQ';
import EducationIQ from '@/pages/agents/EducationIQ';
import MarketingIQ from '@/pages/agents/MarketingIQ';
import GoToMarketIQ from '@/pages/agents/GoToMarketIQ';
import ReferralIQ from '@/pages/agents/ReferralIQ';
import ApplicationTest from '@/pages/ApplicationTest';

export default function DentalApp() {
  return (
    <DentalWrapper>
      <Routes>
        {/* Redirect /dental to dashboard */}
        <Route path="/" element={<Navigate to="/dental/dashboard" replace />} />
        
        {/* Main Dental Pages */}
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/calendar" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <Calendar />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/schedule" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <Schedule />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/analytics" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <Analytics />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/ehr" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <EHR />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/patient-management" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <PatientManagement />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/financial" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <FinancialManagementPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/patient-experience" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <PatientExperiencePage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/ai-automation" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <AIAutomationHub />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/team" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <Team />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/checkin" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <CheckIn />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/insights" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <Insights />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/notifications" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <Notifications />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/help" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <Help />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* AI Agent Routes */}
        <Route path="/agents/communication" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <CommunicationIQ />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Legacy routes for backwards compatibility */}
        <Route path="/agents/appointment" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <CommunicationIQ />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/agents/intake" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <CommunicationIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/agents/go-to-market" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <GoToMarketIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/agents/scribe" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <ScribeIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/agents/claims" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <ClaimsIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/agents/payments" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <PaymentsIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/agents/inventory" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <InventoryIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/agents/insights" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <InsightIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/agents/education" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <EducationIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/agents/marketing" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <MarketingIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/agents/referral" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <ReferralIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/agents/auth" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <AuthIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/agents/ops" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <OpsIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/test" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <ApplicationTest />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </DentalWrapper>
  );
}