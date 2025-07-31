import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { DentalSleepDashboard } from '@/components/dental-sleep/DentalSleepDashboard';
import { SleepStudyManager } from '@/components/dental-sleep/SleepStudyManager';
import { DMETracker } from '@/components/dental-sleep/DMETracker';
import { ClinicalAssistant } from '@/pages/agents/ClinicalAssistant';
import { RevenueAssistant } from '@/pages/agents/RevenueAssistant';
import { CommunicationAssistant } from '@/pages/agents/CommunicationAssistant';
import { OperationsAssistant } from '@/pages/agents/OperationsAssistant';
import { GrowthAssistant } from '@/pages/agents/GrowthAssistant';

export const DentalSleepApp: React.FC = () => {
  return (
    <Layout>
      <Routes>
        {/* Main Navigation */}
        <Route path="/dashboard" element={<DentalSleepDashboard />} />
        <Route path="/patients" element={<div className="p-6"><h1 className="text-3xl font-bold">Patients</h1><p>Patient management coming soon...</p></div>} />
        <Route path="/schedule" element={<div className="p-6"><h1 className="text-3xl font-bold">Schedule</h1><p>Scheduling system coming soon...</p></div>} />
        
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
        
        {/* Consolidated AI Assistants */}
        <Route path="/assistants/clinical" element={<ClinicalAssistant />} />
        <Route path="/assistants/communication" element={<CommunicationAssistant />} />
        <Route path="/assistants/revenue" element={<RevenueAssistant />} />
        <Route path="/assistants/operations" element={<OperationsAssistant />} />
        <Route path="/assistants/growth" element={<GrowthAssistant />} />
        
        {/* Settings */}
        <Route path="/settings" element={<div className="p-6"><h1 className="text-3xl font-bold">Settings</h1><p>Settings coming soon...</p></div>} />
        <Route path="/profile" element={<div className="p-6"><h1 className="text-3xl font-bold">Profile</h1><p>Profile management coming soon...</p></div>} />
        
        {/* Legacy Routes for Backward Compatibility */}
        <Route path="/agents/communication" element={<CommunicationAssistant />} />
        <Route path="/agents/scribe" element={<ClinicalAssistant />} />
        <Route path="/agents/ehr" element={<ClinicalAssistant />} />
        <Route path="/agents/revenue" element={<RevenueAssistant />} />
        <Route path="/agents/insurance" element={<RevenueAssistant />} />
        <Route path="/agents/inventory" element={<OperationsAssistant />} />
        <Route path="/agents/ops" element={<OperationsAssistant />} />
        <Route path="/agents/insight" element={<GrowthAssistant />} />
        <Route path="/agents/education" element={<GrowthAssistant />} />
        <Route path="/agents/growth" element={<GrowthAssistant />} />
        
        {/* Default redirect */}
        <Route path="/" element={<DentalSleepDashboard />} />
        <Route path="*" element={<DentalSleepDashboard />} />
      </Routes>
    </Layout>
  );
};