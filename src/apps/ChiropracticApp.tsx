import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ModernLayout } from '../components/layout/ModernLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { SpecialtyProvider } from '../contexts/SpecialtyContext';
import { ChiropracticDashboard } from '../components/chiropractic/ChiropracticDashboard';
import { Calendar } from '../pages/Calendar';
import { ClinicalAssistant } from '../pages/agents/ClinicalAssistant';
import ScribeIQ from '../pages/agents/ScribeIQ';
import FlowIQConnect from '../pages/agents/CommunicationIQ';
import EHR from '../pages/EHR';
import RevenueIQ from '../pages/agents/RevenueIQ';
import InsuranceIQ from '../pages/agents/InsuranceIQ';
import InventoryIQ from '../pages/agents/InventoryIQ';
import OpsIQ from '../pages/agents/OpsIQ';
import InsightIQ from '../pages/agents/InsightIQ';
import EducationIQ from '../pages/agents/EducationIQ';
import GrowthIQ from '../pages/agents/GrowthIQ';
import Settings from '../pages/Settings';
import { useHealthcareSageAI } from '@/hooks/useHealthcareSageAI';

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
                <FlowIQConnect />
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

          {/* Legacy AI Agents */}
          <Route path="/agents/communication" element={
            <ProtectedRoute requiredRole="staff">
              <ModernLayout>
                <FlowIQConnect />
              </ModernLayout>
            </ProtectedRoute>
          } />

          <Route path="/agents/scribe" element={
            <ProtectedRoute requiredRole="staff">
              <ModernLayout>
                <ScribeIQ />
              </ModernLayout>
            </ProtectedRoute>
          } />

          <Route path="/agents/ehr" element={
            <ProtectedRoute requiredRole="staff">
              <ModernLayout>
                <EHR />
              </ModernLayout>
            </ProtectedRoute>
          } />

          <Route path="/agents/revenue" element={
            <ProtectedRoute requiredRole="staff">
              <ModernLayout>
                <RevenueIQ />
              </ModernLayout>
            </ProtectedRoute>
          } />

          <Route path="/agents/insurance" element={
            <ProtectedRoute requiredRole="staff">
              <ModernLayout>
                <InsuranceIQ />
              </ModernLayout>
            </ProtectedRoute>
          } />

          <Route path="/agents/inventory" element={
            <ProtectedRoute requiredRole="staff">
              <ModernLayout>
                <InventoryIQ />
              </ModernLayout>
            </ProtectedRoute>
          } />

          <Route path="/agents/ops" element={
            <ProtectedRoute requiredRole="staff">
              <ModernLayout>
                <OpsIQ />
              </ModernLayout>
            </ProtectedRoute>
          } />

          <Route path="/agents/insight" element={
            <ProtectedRoute requiredRole="staff">
              <ModernLayout>
                <InsightIQ />
              </ModernLayout>
            </ProtectedRoute>
          } />

          <Route path="/agents/education" element={
            <ProtectedRoute requiredRole="staff">
              <ModernLayout>
                <EducationIQ />
              </ModernLayout>
            </ProtectedRoute>
          } />

          <Route path="/agents/growth" element={
            <ProtectedRoute requiredRole="staff">
              <ModernLayout>
                <GrowthIQ />
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