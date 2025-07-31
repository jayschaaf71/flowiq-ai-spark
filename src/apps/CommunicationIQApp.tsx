import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CommunicationIQWrapper } from '@/components/wrappers/CommunicationIQWrapper';
import FlowIQConnect from '@/pages/agents/CommunicationIQ';

const FlowIQConnectApp = () => {
  const tenantConfig = {
    branding: {
      primaryColor: '#10b981',
      name: 'FlowIQ Connect',
      logo: '/logo.png'
    },
    features: {
      voiceBooking: true,
      aiConflictResolution: true,
      multiProvider: true,
      waitlistManagement: true,
      smartCommunication: true,
      automatedFollowUp: true,
      customerSupport: true,
      customerOnboarding: true,
      formBuilder: true,
      voiceOnboarding: true,
      smsReminders: true,
      emailCommunication: true,
      aiAssistant: true
    },
    integrations: {
      calendar: 'google' as const,
      crm: 'integrated',
      sms: true,
      email: true,
      voip: true,
      serviceManagement: true
    }
  };

  return (
    <CommunicationIQWrapper mode="standalone" tenantConfig={tenantConfig}>
      <Routes>
        {/* Main communication interface - comprehensive FlowIQ Connect */}
        <Route path="/" element={<FlowIQConnect />} />
        
        {/* All routes handled by FlowIQ Connect */}
        <Route path="/dashboard" element={<FlowIQConnect />} />
        <Route path="/calendar" element={<FlowIQConnect />} />
        <Route path="/booking" element={<FlowIQConnect />} />
        <Route path="/onboarding" element={<FlowIQConnect />} />
        <Route path="/forms" element={<FlowIQConnect />} />
        <Route path="/communications" element={<FlowIQConnect />} />
        <Route path="/voice" element={<FlowIQConnect />} />
        <Route path="/reminders" element={<FlowIQConnect />} />
        
        {/* Success/confirmation pages */}
        <Route path="/confirmation/:serviceId" element={
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
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
            <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
            <a href="/" className="text-green-600 hover:underline">
              Return to Service Hub
            </a>
          </div>
        } />
      </Routes>
    </CommunicationIQWrapper>
  );
};

export default FlowIQConnectApp;