
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EHRDashboard } from "@/components/ehr/EHRDashboard";
import { PatientRecords } from "@/components/ehr/PatientRecords";
import { SOAPNotes } from "@/components/ehr/SOAPNotes";
import { MigrationDashboard } from "@/components/ehr/MigrationDashboard";
import { EHRAnalytics } from "@/components/ehr/EHRAnalytics";

const EHRIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <Layout>
      <PageHeader 
        title="EHR iQ"
        subtitle="AI-powered Electronic Health Records management"
        badge="AI Agent"
      />
      
      <div className="p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="patients">Patient Records</TabsTrigger>
            <TabsTrigger value="soap">SOAP Notes</TabsTrigger>
            <TabsTrigger value="migration">Data Migration</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <EHRDashboard />
          </TabsContent>

          <TabsContent value="patients" className="space-y-4">
            <PatientRecords />
          </TabsContent>

          <TabsContent value="soap" className="space-y-4">
            <SOAPNotes />
          </TabsContent>

          <TabsContent value="migration" className="space-y-4">
            <MigrationDashboard />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <EHRAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EHRIQ;
