import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { StandaloneAppointmentIQ } from '@/components/standalone/StandaloneAppointmentIQ';

const AppointmentIQApp = () => {
  const tenantConfig = {
    branding: {
      primaryColor: '#3b82f6',
      name: 'AppointmentIQ',
      logo: '/logo.png'
    },
    features: {
      voiceBooking: true,
      aiConflictResolution: true,
      multiProvider: true,
      waitlistManagement: true
    },
    integrations: {
      calendar: 'google' as const,
      sms: true,
      email: true
    }
  };

  return (
    <Routes>
      <Route path="/*" element={<StandaloneAppointmentIQ tenantConfig={tenantConfig} />} />
    </Routes>
  );
};

export default AppointmentIQApp;