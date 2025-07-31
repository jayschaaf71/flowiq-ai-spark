import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CommunicationIQWrapper } from '@/components/wrappers/CommunicationIQWrapper';
import CommunicationIQ from '@/pages/agents/CommunicationIQ';

const CommunicationIQApp = () => {
  const tenantConfig = {
    branding: {
      primaryColor: '#3b82f6',
      name: 'Communication IQ',
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
      patientIntake: true,
      formBuilder: true,
      voiceIntake: true,
      smsReminders: true,
      emailCommunication: true,
      aiAssistant: true
    },
    integrations: {
      calendar: 'google' as const,
      ehr: 'integrated',
      sms: true,
      email: true,
      voip: true,
      crm: true
    }
  };

  return (
    <CommunicationIQWrapper mode="standalone" tenantConfig={tenantConfig}>
      <Routes>
        {/* Main communication interface - comprehensive Communication IQ */}
        <Route path="/" element={<CommunicationIQ />} />
        
        {/* All routes handled by Communication IQ */}
        <Route path="/dashboard" element={<CommunicationIQ />} />
        <Route path="/calendar" element={<CommunicationIQ />} />
        <Route path="/booking" element={<CommunicationIQ />} />
        <Route path="/intake" element={<CommunicationIQ />} />
        <Route path="/forms" element={<CommunicationIQ />} />
        <Route path="/communications" element={<CommunicationIQ />} />
        <Route path="/voice" element={<CommunicationIQ />} />
        <Route path="/reminders" element={<CommunicationIQ />} />
        
        {/* Success/confirmation pages */}
        <Route path="/confirmation/:appointmentId" element={
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              ✅ Communication Confirmed!
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
            <a href="/" className="text-blue-600 hover:underline">
              Return to Communication Hub
            </a>
          </div>
        } />
      </Routes>
    </CommunicationIQWrapper>
  );
};

export default CommunicationIQApp;