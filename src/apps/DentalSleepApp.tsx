import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { DentalSleepDashboard } from '@/components/dental-sleep/DentalSleepDashboard';
import { SleepStudyManager } from '@/components/dental-sleep/SleepStudyManager';
import { DMETracker } from '@/components/dental-sleep/DMETracker';
import { ClinicalAssistant } from '@/pages/agents/ClinicalAssistant';
import { RevenueAssistant } from '@/pages/agents/RevenueAssistant';
import { CommunicationAssistant } from '@/pages/agents/CommunicationAssistant';
import { OperationsAssistant } from '@/pages/agents/OperationsAssistant';
import { GrowthAssistant } from '@/pages/agents/GrowthAssistant';
import { IntegrationDashboard } from '@/components/integrations/IntegrationDashboard';
import Settings from '@/pages/Settings';
import Patients from '@/pages/Patients';
import Schedule from '@/pages/Schedule';
import { ScheduleSettings } from '@/components/schedule/ScheduleSettings';

// Profile Component
const Profile = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" defaultValue="Staff Member" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" defaultValue="staff@midwestdental.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" defaultValue="Staff Member" disabled />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Security</h2>
          <div className="space-y-4">
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Change Password
            </button>
            <button className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
              Enable Two-Factor Authentication
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DentalSleepApp: React.FC = () => {
  return (
    <ModernLayout>
      <Routes>
        {/* Main Navigation */}
        <Route path="/dashboard" element={<DentalSleepDashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/schedule" element={<Schedule />} />

        {/* Clinical Navigation */}
        <Route path="/clinical" element={<div className="p-6"><h1 className="text-3xl font-bold">Clinical</h1><p>Clinical tools coming soon...</p></div>} />
        <Route path="/clinical/soap-notes" element={<div className="p-6"><h1 className="text-3xl font-bold">SOAP Notes</h1><p>SOAP notes coming soon...</p></div>} />
        <Route path="/clinical/records" element={<div className="p-6"><h1 className="text-3xl font-bold">Patient Records</h1><p>Patient records coming soon...</p></div>} />
        <Route path="/clinical/sleep-studies" element={<SleepStudyManager />} />
        <Route path="/clinical/dme" element={<DMETracker />} />
        <Route path="/clinical/compliance" element={<div className="p-6"><h1 className="text-3xl font-bold">Compliance</h1><p>Compliance tracking coming soon...</p></div>} />

        {/* Administrative Navigation */}
        <Route path="/revenue" element={<div className="p-6"><h1 className="text-3xl font-bold">Revenue</h1><p>Revenue management coming soon...</p></div>} />
        <Route path="/revenue/claims" element={<div className="p-6"><h1 className="text-3xl font-bold">Claims</h1><p>Claims management coming soon...</p></div>} />
        <Route path="/revenue/payments" element={<div className="p-6"><h1 className="text-3xl font-bold">Payments</h1><p>Payment processing coming soon...</p></div>} />
        <Route path="/analytics" element={<div className="p-6"><h1 className="text-3xl font-bold">Analytics</h1><p>Analytics dashboard coming soon...</p></div>} />

        {/* Integration Dashboard */}
        <Route path="/integrations" element={<IntegrationDashboard />} />

        {/* Consolidated AI Assistants */}
        <Route path="/assistants/clinical" element={<ClinicalAssistant />} />
        <Route path="/assistants/communication" element={<CommunicationAssistant />} />
        <Route path="/assistants/revenue" element={<RevenueAssistant />} />
        <Route path="/assistants/operations" element={<OperationsAssistant />} />
        <Route path="/assistants/growth" element={<GrowthAssistant />} />

        {/* Settings */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/schedule-settings" element={<ScheduleSettings />} />
        <Route path="/profile" element={<Profile />} />

        {/* Legacy Routes for Backward Compatibility */}
        <Route path="/agents/communication" element={<CommunicationAssistant />} />
        <Route path="/agents/scribe" element={<ClinicalAssistant />} />
        <Route path="/agents/ehr" element={<ClinicalAssistant />} />
        <Route path="/agents/revenue" element={<RevenueAssistant />} />
        <Route path="/agents/insurance" element={<RevenueAssistant />} />
        <Route path="/agents/inventory" element={<OperationsAssistant />} />
        <Route path="/agents/marketing" element={<GrowthAssistant />} />
        <Route path="/agents/analytics" element={<GrowthAssistant />} />
        <Route path="/agents/operations" element={<OperationsAssistant />} />
        <Route path="/agents/clinical" element={<ClinicalAssistant />} />

        {/* Default route */}
        <Route path="/" element={<DentalSleepDashboard />} />
        <Route path="*" element={<DentalSleepDashboard />} />
      </Routes>
    </ModernLayout>
  );
};