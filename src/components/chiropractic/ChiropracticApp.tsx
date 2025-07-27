import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ChiropracticDashboard } from './ChiropracticDashboard';
import { OnboardingGate } from '@/components/onboarding/OnboardingGate';

export const ChiropracticApp = () => {
  console.log('🏥 ChiropracticApp: Rendering ChiropracticApp component');
  
  return (
    <OnboardingGate>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<ChiropracticDashboard />} />
          <Route path="/" element={<ChiropracticDashboard />} />
          {/* Add more chiropractic routes here as needed */}
        </Routes>
      </Layout>
    </OnboardingGate>
  );
};