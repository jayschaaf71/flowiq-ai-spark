import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ModernLayout } from '../../components/layout/ModernLayout';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { SpecialtyProvider } from '../../contexts/SpecialtyContext';
import { DentalSleepDashboard } from '../../components/dental-sleep/DentalSleepDashboard';
import { Calendar } from '../../pages/Calendar';
import { CommunicationAssistant } from '../../pages/agents/CommunicationAssistant';
import { ClinicalAssistant } from '../../pages/agents/ClinicalAssistant';
import { RevenueAssistant } from '../../pages/agents/RevenueAssistant';
import { OperationsAssistant } from '../../pages/agents/OperationsAssistant';
import { GrowthAssistant } from '../../pages/agents/GrowthAssistant';
import Settings from '../../pages/Settings';
import { useHealthcareSageAI } from '@/hooks/useHealthcareSageAI';

export const DentalSleepApp: React.FC = () => {
  const healthcareSage = useHealthcareSageAI();
  console.log('🦷 DentalSleepApp: Rendering standalone DentalSleepApp');
  console.log('🦷 DentalSleepApp: Current pathname:', window.location.pathname);

  return (
    <SpecialtyProvider>
      <div className="dental-sleep-app">
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Main Dental Sleep Pages */}
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole="staff">
              <ModernLayout>
                <DentalSleepDashboard />
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