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
import { CommunicationAssistant } from '@/pages/agents/CommunicationAssistant';
import { ClinicalAssistant } from '@/pages/agents/ClinicalAssistant';
import { RevenueAssistant } from '@/pages/agents/RevenueAssistant';
import { OperationsAssistant } from '@/pages/agents/OperationsAssistant';
import { GrowthAssistant } from '@/pages/agents/GrowthAssistant';
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

        {/* AI Assistant routes */}
        <Route path="/agents/communication" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <CommunicationAssistant />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/agents/clinical" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <ClinicalAssistant />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/agents/revenue" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <RevenueAssistant />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/agents/operations" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <OperationsAssistant />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/agents/growth" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <GrowthAssistant />
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