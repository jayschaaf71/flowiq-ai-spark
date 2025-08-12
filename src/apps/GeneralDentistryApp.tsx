import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SpecialtyWrapper } from '@/components/wrappers/SpecialtyWrapper';
import { DentalDashboard } from '@/components/specialty/dashboards/DentalDashboard';
import Schedule from '@/pages/Schedule';
import PatientManagement from '@/pages/PatientManagement';
import Team from '@/pages/Team';
import Settings from '@/pages/Settings';

const GeneralDentistryApp = () => {
  return (
    <SpecialtyWrapper specialty="general-dentistry">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRole="staff">
            <ModernLayout><DentalDashboard /></ModernLayout>
          </ProtectedRoute>
        } />
        <Route path="/schedule" element={
          <ProtectedRoute requiredRole="staff">
            <ModernLayout><Schedule /></ModernLayout>
          </ProtectedRoute>
        } />
        <Route path="/patients" element={
          <ProtectedRoute requiredRole="staff">
            <ModernLayout><PatientManagement /></ModernLayout>
          </ProtectedRoute>
        } />
        <Route path="/team" element={
          <ProtectedRoute requiredRole="staff">
            <ModernLayout><Team /></ModernLayout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute requiredRole="staff">
            <ModernLayout><Settings /></ModernLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </SpecialtyWrapper>
  );
};

export default GeneralDentistryApp;