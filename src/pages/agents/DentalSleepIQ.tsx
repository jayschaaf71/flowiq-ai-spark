import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DentalSleepDashboard } from "@/components/specialty/dashboards/DentalSleepDashboard";
import { DentalSleepTemplates } from "@/components/specialty/DentalSleepTemplates";
import { DentalSleepEHR } from "@/components/ehr/specialty/DentalSleepEHR";
import { DentalSleepPatientPortal } from "@/components/patient-experience/DentalSleepPatientPortal";
import { ClaimsDashboard } from "@/components/claims/ClaimsDashboard";
import { ScheduleDashboard } from "@/components/schedule/ScheduleDashboard";
import { SleepStudyManager } from "@/components/dental-sleep/SleepStudyManager";
import { DMETracker } from "@/components/dental-sleep/DMETracker";

const DentalSleepIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dental Sleep IQ"
        subtitle="Complete sleep medicine practice management with AI-powered workflows"
        badge="Sleep Medicine"
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="ehr">Sleep EHR</TabsTrigger>
          <TabsTrigger value="studies">Sleep Studies</TabsTrigger>
          <TabsTrigger value="dme">DME Tracker</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="portal">Patient Portal</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <DentalSleepDashboard />
        </TabsContent>

        <TabsContent value="ehr" className="space-y-4">
          <DentalSleepEHR />
        </TabsContent>

        <TabsContent value="studies" className="space-y-4">
          <SleepStudyManager />
        </TabsContent>

        <TabsContent value="dme" className="space-y-4">
          <DMETracker />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <DentalSleepTemplates />
        </TabsContent>

        <TabsContent value="claims" className="space-y-4">
          <ClaimsDashboard />
        </TabsContent>

        <TabsContent value="portal" className="space-y-4">
          <DentalSleepPatientPortal />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DentalSleepIQ;