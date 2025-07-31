import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { SpecialtyProvider } from '../../contexts/SpecialtyContext';
import { DentalSleepDashboard } from './DentalSleepDashboard';
import { Calendar } from '../../pages/Calendar';
import ScribeIQ from '../../pages/agents/ScribeIQ';
import FlowIQConnect from '../../pages/agents/CommunicationIQ';
import EHR from '../../pages/EHR';
import RevenueIQ from '../../pages/agents/RevenueIQ';
import InsuranceIQ from '../../pages/agents/InsuranceIQ';
import InventoryIQ from '../../pages/agents/InventoryIQ';
import OpsIQ from '../../pages/agents/OpsIQ';
import InsightIQ from '../../pages/agents/InsightIQ';
import EducationIQ from '../../pages/agents/EducationIQ';
import GrowthIQ from '../../pages/agents/GrowthIQ';
import Settings from '../../pages/Settings';

export const DentalSleepApp: React.FC = () => {
  console.log('🦷 DentalSleepApp: Rendering standalone DentalSleepApp');

  return (
    <SpecialtyProvider>
      <div className="dental-sleep-app">
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Main Dental Sleep Pages */}
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole="staff">
              <Layout>
                <DentalSleepDashboard />
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

          {/* AI Agents */}
          <Route path="/agents/communication" element={
            <ProtectedRoute requiredRole="staff">
              <Layout>
                <FlowIQConnect />
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

          <Route path="/agents/ehr" element={
            <ProtectedRoute requiredRole="staff">
              <Layout>
                <EHR />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/agents/revenue" element={
            <ProtectedRoute requiredRole="staff">
              <Layout>
                <RevenueIQ />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/agents/insurance" element={
            <ProtectedRoute requiredRole="staff">
              <Layout>
                <InsuranceIQ />
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

          <Route path="/agents/ops" element={
            <ProtectedRoute requiredRole="staff">
              <Layout>
                <OpsIQ />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/agents/insight" element={
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

          <Route path="/agents/growth" element={
            <ProtectedRoute requiredRole="staff">
              <Layout>
                <GrowthIQ />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Settings */}
          <Route path="/settings" element={
            <ProtectedRoute requiredRole="staff">
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </SpecialtyProvider>
  );
}; 