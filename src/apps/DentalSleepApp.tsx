import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DentalSleepWrapper } from '@/components/wrappers/DentalSleepWrapper';

// Dental Sleep specific components
import { DentalSleepDashboard } from '@/components/specialty/dashboards/DentalSleepDashboard';
import { DentalSleepTemplates } from '@/components/specialty/DentalSleepTemplates';
import { DentalSleepEHR } from '@/components/ehr/specialty/DentalSleepEHR';
import { DentalSleepPatientPortal } from '@/components/patient-experience/DentalSleepPatientPortal';
import { SleepStudyManager } from '@/components/dental-sleep/SleepStudyManager';
import { DMETracker } from '@/components/dental-sleep/DMETracker';

// Shared components
import { ClaimsDashboard } from '@/components/claims/ClaimsDashboard';
import { ScheduleDashboard } from '@/components/schedule/ScheduleDashboard';
import PatientManagement from '@/pages/PatientManagement';
import Team from '@/pages/Team';
import Help from '@/pages/Help';
import Settings from '@/pages/Settings';

// AI Agents that apply to dental sleep
import AppointmentIQ from '@/pages/agents/AppointmentIQ';
import IntakeIQ from '@/pages/agents/IntakeIQ';
import ScribeIQ from '@/pages/agents/ScribeIQ';
import ClaimsIQ from '@/pages/agents/ClaimsIQ';
import PaymentsIQ from '@/pages/agents/PaymentsIQ';
import AuthIQ from '@/pages/agents/AuthIQ';
import EducationIQ from '@/pages/agents/EducationIQ';
import MarketingIQ from '@/pages/agents/MarketingIQ';
import ReferralIQ from '@/pages/agents/ReferralIQ';

export default function DentalSleepApp() {
  return (
    <DentalSleepWrapper>
      <Routes>
        {/* Redirect /dental-sleep to dashboard */}
        <Route path="/" element={<Navigate to="/dental-sleep/dashboard" replace />} />
        
        {/* Main Dental Sleep Dashboard */}
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <DentalSleepDashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Sleep Medicine Specific Features */}
        <Route path="/sleep-studies" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <SleepStudyManager />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/dme-tracker" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <DMETracker />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/ehr" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <DentalSleepEHR />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/templates" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <DentalSleepTemplates />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/patient-portal" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <DentalSleepPatientPortal />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Shared Features */}
        <Route path="/schedule" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <ScheduleDashboard recentActivity={[]} upcomingTasks={[]} />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/claims" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <ClaimsDashboard />
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
        
        <Route path="/team" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <Team />
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
        <Route path="/agents/appointment" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <AppointmentIQ />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/agents/intake" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <IntakeIQ />
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
      </Routes>
    </DentalSleepWrapper>
  );
}