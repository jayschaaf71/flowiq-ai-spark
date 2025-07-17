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
import DentalSleepInsights from '@/components/specialty/insights/DentalSleepInsights';

// AI Agents that apply to dental sleep
import CommunicationIQ from '@/pages/agents/CommunicationIQ';
import ScribeIQ from '@/pages/agents/ScribeIQ';
import ClaimsIQ from '@/pages/agents/ClaimsIQ';
import PaymentsIQ from '@/pages/agents/PaymentsIQ';
import AuthIQ from '@/pages/agents/AuthIQ';
import EducationIQ from '@/pages/agents/EducationIQ';
import MarketingIQ from '@/pages/agents/MarketingIQ';
import ReferralIQ from '@/pages/agents/ReferralIQ';
import ApplicationTest from '@/pages/ApplicationTest';

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
        
        <Route path="/insights" element={
          <ProtectedRoute requiredRole="staff">
            <Layout>
              <DentalSleepInsights />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Shared Features */}
        <Route path="/schedule" element={
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
        
        <Route path="/test" element={
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