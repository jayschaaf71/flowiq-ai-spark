import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SpecialtyWrapper } from '@/components/wrappers/SpecialtyWrapper';
import { Dashboard } from '@/pages/Dashboard';
import Schedule from '@/pages/Schedule';
import PatientManagement from '@/pages/PatientManagement';
import Team from '@/pages/Team';
import Settings from '@/pages/Settings';

const MedspaApp = () => {
  return (
    <SpecialtyWrapper specialty="medspa">
      <Routes>
        <Route path="/" element={<Navigate to="/medspa/dashboard" replace />} />
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRole="staff">
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/schedule" element={
          <ProtectedRoute requiredRole="staff">
            <Layout><Schedule /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/patients" element={
          <ProtectedRoute requiredRole="staff">
            <Layout><PatientManagement /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/team" element={
          <ProtectedRoute requiredRole="staff">
            <Layout><Team /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute requiredRole="staff">
            <Layout><Settings /></Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </SpecialtyWrapper>
  );
};

export default MedspaApp;