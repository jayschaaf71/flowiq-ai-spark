
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PatientPortalDashboard } from '@/components/patient-experience/PatientPortalDashboard';
import { TelemedicineHub } from '@/components/patient-experience/TelemedicineHub';
import { PatientEducationCenter } from '@/components/patient-experience/PatientEducationCenter';
import { SatisfactionTracking } from '@/components/patient-experience/SatisfactionTracking';
import { CommunicationCenter } from '@/components/patient-experience/CommunicationCenter';
import { FollowUpWorkflows } from '@/components/patient-experience/FollowUpWorkflows';
import { NotificationCenter } from '@/components/patient-experience/NotificationCenter';
import { PatientEngagementHub } from '@/components/patient-experience/PatientEngagementHub';

export const PatientExperiencePage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="portal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="portal">Portal</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="workflows">Follow-ups</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="telemedicine">Telemedicine</TabsTrigger>
        </TabsList>
        
        <TabsContent value="portal" className="space-y-6">
          <PatientPortalDashboard />
        </TabsContent>
        
        <TabsContent value="communication" className="space-y-6">
          <CommunicationCenter />
        </TabsContent>
        
        <TabsContent value="workflows" className="space-y-6">
          <FollowUpWorkflows />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <NotificationCenter />
        </TabsContent>
        
        <TabsContent value="engagement" className="space-y-6">
          <PatientEngagementHub />
        </TabsContent>
        
        <TabsContent value="satisfaction" className="space-y-6">
          <SatisfactionTracking />
        </TabsContent>
        
        <TabsContent value="education" className="space-y-6">
          <PatientEducationCenter />
        </TabsContent>
        
        <TabsContent value="telemedicine" className="space-y-6">
          <TelemedicineHub />
        </TabsContent>
      </Tabs>
    </div>
  );
};
