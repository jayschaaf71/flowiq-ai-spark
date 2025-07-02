import React from 'react';
import { createRoot } from 'react-dom/client';
import { StandaloneAppointmentIQ } from '@/components/standalone/StandaloneAppointmentIQ';
import { Toaster } from '@/components/ui/toaster';
import '@/index.css';

// Configuration can be passed via window object or environment
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

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <StandaloneAppointmentIQ tenantConfig={tenantConfig} />
      <Toaster />
    </React.StrictMode>
  );
}