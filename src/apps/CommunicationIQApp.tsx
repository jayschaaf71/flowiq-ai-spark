import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { StandaloneCommunicationIQ } from '@/components/standalone/StandaloneCommunicationIQ';

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
      customerSupport: true
    },
    integrations: {
      calendar: 'google' as const,
      sms: true,
      email: true,
      voip: true,
      crm: true
    }
  };

  return (
    <Routes>
      <Route path="/*" element={<StandaloneCommunicationIQ tenantConfig={tenantConfig} />} />
    </Routes>
  );
};

export default CommunicationIQApp;