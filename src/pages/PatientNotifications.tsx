import React from 'react';
import { PatientNotificationCenter } from '@/components/notifications/PatientNotificationCenter';

const PatientNotifications = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Notifications</h1>
          <p className="text-gray-600">Stay updated with your healthcare information and appointments</p>
        </div>
        
        <PatientNotificationCenter />
      </div>
    </div>
  );
};

export default PatientNotifications;