
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PatientPortalDashboard } from '@/components/patient-experience/PatientPortalDashboard';
import { TelemedicineHub } from '@/components/patient-experience/TelemedicineHub';
import { PatientEducationCenter } from '@/components/patient-experience/PatientEducationCenter';
import { SatisfactionTracking } from '@/components/patient-experience/SatisfactionTracking';
import { CommunicationCenter } from '@/components/patient-experience/CommunicationCenter';

export const PatientExperiencePage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="portal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="portal">Patient Portal</TabsTrigger>
          <TabsTrigger value="telemedicine">Telemedicine</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>
        
        <TabsContent value="portal" className="space-y-6">
          <PatientPortalDashboard />
        </TabsContent>
        
        <TabsContent value="telemedicine" className="space-y-6">
          <TelemedicineHub />
        </TabsContent>
        
        <TabsContent value="education" className="space-y-6">
          <PatientEducationCenter />
        </TabsContent>
        
        <TabsContent value="satisfaction" className="space-y-6">
          <SatisfactionTracking />
        </TabsContent>
        
        <TabsContent value="communication" className="space-y-6">
          <CommunicationCenter />
        </TabsContent>
      </Tabs>
    </div>
  );
};
