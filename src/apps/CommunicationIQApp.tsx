import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ModernLayout } from '@/components/layout/ModernLayout';
import FlowIQConnect from '@/pages/agents/CommunicationIQ';
import { ClinicalAssistant } from '@/pages/agents/ClinicalAssistant';
import { CommunicationAssistant } from '@/pages/agents/CommunicationAssistant';
import { RevenueAssistant } from '@/pages/agents/RevenueAssistant';
import { OperationsAssistant } from '@/pages/agents/OperationsAssistant';
import { GrowthAssistant } from '@/pages/agents/GrowthAssistant';
import Settings from '@/pages/Settings';
import Profile from '@/pages/Profile';

const FlowIQConnectApp = () => {
  return (
    <ModernLayout>
      <Routes>
        {/* Main communication interface - comprehensive FlowIQ Connect */}
        <Route path="/" element={<FlowIQConnect />} />

        {/* Main navigation routes */}
        <Route path="/dashboard" element={<FlowIQConnect />} />
        <Route path="/patients" element={<FlowIQConnect />} />
        <Route path="/schedule" element={<FlowIQConnect />} />
        <Route path="/calendar" element={<FlowIQConnect />} />
        <Route path="/booking" element={<FlowIQConnect />} />
        <Route path="/onboarding" element={<FlowIQConnect />} />
        <Route path="/forms" element={<FlowIQConnect />} />
        <Route path="/communications" element={<FlowIQConnect />} />
        <Route path="/voice" element={<FlowIQConnect />} />
        <Route path="/reminders" element={<FlowIQConnect />} />

        {/* AI Assistant routes */}
        <Route path="/assistants/clinical" element={<ClinicalAssistant />} />
        <Route path="/assistants/communication" element={<CommunicationAssistant />} />
        <Route path="/assistants/revenue" element={<RevenueAssistant />} />
        <Route path="/assistants/operations" element={<OperationsAssistant />} />
        <Route path="/assistants/growth" element={<GrowthAssistant />} />

        {/* Account routes */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />

        {/* Success/confirmation pages */}
        <Route path="/confirmation/:serviceId" element={
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              ✅ Service Confirmed!
            </h2>
            <p className="text-gray-600">
              You'll receive a confirmation message shortly.
            </p>
          </div>
        } />

        {/* Error/fallback */}
        <Route path="*" element={
          <div className="text-center py-8">
            <h1 className="text-xl font-semibold mb-4">Page Not Found</h1>
            <p className="text-gray-600 mb-6">
              The page you're looking for doesn't exist on FlowIQ Connect.
            </p>
            <div className="space-y-4">
              <a href="/" className="text-blue-600 hover:underline block">
                Return to FlowIQ Connect Dashboard
              </a>
              <a href="/assistants/clinical" className="text-blue-600 hover:underline block">
                Try Clinical Assistant
              </a>
              <a href="/assistants/communication" className="text-blue-600 hover:underline block">
                Try Communication Assistant
              </a>
              <a href="/settings" className="text-blue-600 hover:underline block">
                Go to Settings
              </a>
            </div>
          </div>
        } />
      </Routes>
    </ModernLayout>
  );
};

export default FlowIQConnectApp;