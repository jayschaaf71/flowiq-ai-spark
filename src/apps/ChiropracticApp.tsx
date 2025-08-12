import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ModernLayout } from '../components/layout/ModernLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { SpecialtyProvider } from '../contexts/SpecialtyContext';
import { ChiropracticDashboard } from '../components/chiropractic/ChiropracticDashboard';
import { Calendar } from '../pages/Calendar';
import { ClinicalAssistant } from '../pages/agents/ClinicalAssistant';
import { CommunicationAssistant } from '../pages/agents/CommunicationAssistant';
import { RevenueAssistant } from '../pages/agents/RevenueAssistant';
import { OperationsAssistant } from '../pages/agents/OperationsAssistant';
import { GrowthAssistant } from '../pages/agents/GrowthAssistant';
import Settings from '../pages/Settings';
import { useHealthcareSageAI } from '@/hooks/useHealthcareSageAI';

// Import existing clinical components
import { ClinicalDashboard } from '@/components/clinical/ClinicalDashboard';
import { SOAPNotesManager } from '@/components/clinical/SOAPNotesManager';
import { PatientRecords } from '@/components/clinical/PatientRecords';

// Import existing revenue components
import { RevenueDashboard } from '@/components/revenue/RevenueDashboard';
import { RevenueCycleManager } from '@/components/revenue/RevenueCycleManager';
import { InsuranceManager } from '@/components/revenue/InsuranceManager';
import { RevenueAnalytics } from '@/components/revenue/RevenueAnalytics';

// Import patient and schedule pages
import Patients from '@/pages/Patients';
import Schedule from '@/pages/Schedule';

export const ChiropracticApp: React.FC = () => {
  const healthcareSage = useHealthcareSageAI();
  console.log('🏥 ChiropracticApp: Rendering standalone ChiropracticApp');
  console.log('🏥 ChiropracticApp: Current pathname:', window.location.pathname);

  return (
    <SpecialtyProvider>
      <div className="chiropractic-app">
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Main Chiropractic Pages */}
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole="staff">
              <ModernLayout>
                <ChiropracticDashboard />
              </ModernLayout>
            </ProtectedRoute>
          } />

          <Route path="/calendar" element={
            <ProtectedRoute requiredRole="staff">
              <ModernLayout>
                <Calendar />
              </ModernLayout>
            </ProtectedRoute>
          } />

          <Route path="/patients" element={
            <ProtectedRoute requiredRole="staff">
              <ModernLayout>
                <Patients />
              </ModernLayout>
            </ProtectedRoute>
          } />

          <Route path="/schedule" element={
            <ProtectedRoute requiredRole="staff">
              <ModernLayout>
                <Schedule />
              </ModernLayout>
            </ProtectedRoute>
          } />

          {/* Clinical Navigation */}
          <Route path="/clinical" element={
            <ProtectedRoute requiredRole="clinical">
              <ModernLayout>
                <ClinicalDashboard />
              </ModernLayout>
            </ProtectedRoute>
          } />

          <Route path="/clinical/soap-notes" element={
            <ProtectedRoute requiredRole="clinical">
              <ModernLayout>
                <SOAPNotesManager />
              </ModernLayout>
            </ProtectedRoute>
          } />

          <Route path="/clinical/records" element={
            <ProtectedRoute requiredRole="clinical">
              <ModernLayout>
                <PatientRecords />
              </ModernLayout>
            </ProtectedRoute>
          } />

          {/* Administrative Navigation */}
          <Route path="/revenue" element={
            <ProtectedRoute requiredRole="admin">
              <ModernLayout>
                <RevenueDashboard />
              </ModernLayout>
            </ProtectedRoute>
          } />

          <Route path="/revenue/claims" element={
            <ProtectedRoute requiredRole="admin">
              <ModernLayout>
                <RevenueCycleManager />
              </ModernLayout>
            </ProtectedRoute>
          } />

          <Route path="/revenue/payments" element={
            <ProtectedRoute requiredRole="admin">
              <ModernLayout>
                <InsuranceManager />
              </ModernLayout>
            </ProtectedRoute>
          } />

          <Route path="/analytics" element={
            <ProtectedRoute requiredRole="manager">
              <ModernLayout>
                <RevenueAnalytics />
              </ModernLayout>
            </ProtectedRoute>
          } />

          {/* AI Assistants */}
          <Route path="/ai/clinical" element={
            <ProtectedRoute requiredRole="staff">
              <ModernLayout>
                <ClinicalAssistant />
              </ModernLayout>
            </ProtectedRoute>
          } />

          <Route path="/ai/communication" element={
            <ProtectedRoute requiredRole="staff">
              <ModernLayout>
                <CommunicationIQ />
              </ModernLayout>
            </ProtectedRoute>
          } />

          <Route path="/ai/revenue" element={
            <ProtectedRoute requiredRole="staff">
              <ModernLayout>
                <RevenueIQ />
              </ModernLayout>
            </ProtectedRoute>
          } />

          <Route path="/ai/operations" element={
            <ProtectedRoute requiredRole="staff">
              <ModernLayout>
                <OpsIQ />
              </ModernLayout>
            </ProtectedRoute>
          } />

          <Route path="/ai/growth" element={
            <ProtectedRoute requiredRole="staff">
              <ModernLayout>
                <GrowthIQ />
              </ModernLayout>
            </ProtectedRoute>
          } />

          {/* AI Assistants */}
          <Route path="/agents/communication" element={
            <ProtectedRoute requiredRole="staff">
              <ModernLayout>
                <CommunicationAssistant />
              </ModernLayout>
            </ProtectedRoute>
          } />

          <Route path="/agents/clinical" element={
            <ProtectedRoute requiredRole="staff">
              <ModernLayout>
                <ClinicalAssistant />
              </ModernLayout>
            </ProtectedRoute>
          } />

          <Route path="/agents/revenue" element={
            <ProtectedRoute requiredRole="staff">
              <ModernLayout>
                <RevenueAssistant />
              </ModernLayout>
            </ProtectedRoute>
          } />

          <Route path="/agents/operations" element={
            <ProtectedRoute requiredRole="staff">
              <ModernLayout>
                <OperationsAssistant />
              </ModernLayout>
            </ProtectedRoute>
          } />

          <Route path="/agents/growth" element={
            <ProtectedRoute requiredRole="staff">
              <ModernLayout>
                <GrowthAssistant />
              </ModernLayout>
            </ProtectedRoute>
          } />

          {/* Settings */}
          <Route path="/settings" element={
            <ProtectedRoute requiredRole="staff">
              <ModernLayout>
                <Settings />
              </ModernLayout>
            </ProtectedRoute>
          } />

          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </SpecialtyProvider>
  );
}; 