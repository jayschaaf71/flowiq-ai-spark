import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClinicalDashboard } from '@/components/clinical/ClinicalDashboard';
import { SOAPNotesManager } from '@/components/clinical/SOAPNotesManager';
import { TreatmentPlansManager } from '@/components/clinical/TreatmentPlansManager';
import { PatientRecords } from '@/components/clinical/PatientRecords';

export const ClinicalAssistant = () => {
  const [selectedTab, setSelectedTab] = useState('dashboard');

  return (
    <div className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="soap-notes">SOAP Notes</TabsTrigger>
          <TabsTrigger value="treatment-plans">Treatment Plans</TabsTrigger>
          <TabsTrigger value="patient-records">Patient Records</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <ClinicalDashboard />
        </TabsContent>

        <TabsContent value="soap-notes">
          <SOAPNotesManager />
        </TabsContent>

        <TabsContent value="treatment-plans">
          <TreatmentPlansManager />
        </TabsContent>

        <TabsContent value="patient-records">
          <PatientRecords />
        </TabsContent>
      </Tabs>
    </div>
  );
}; 