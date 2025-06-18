
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IntakeDashboard } from "@/components/intake/IntakeDashboard";
import { IntakeForms } from "@/components/intake/IntakeForms";
import { FormBuilder } from "@/components/intake/FormBuilder";
import { FormTemplates } from "@/components/intake/FormTemplates";
import { PatientRegistration } from "@/components/intake/PatientRegistration";
import { IntakeAnalytics } from "@/components/intake/IntakeAnalytics";
import { TrendingUp } from "lucide-react";

const IntakeIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <Layout>
      <PageHeader 
        title="Intake iQ"
        subtitle="AI-powered patient intake and form management"
        badge="AI Agent"
      />
      
      <div className="p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="forms">Active Forms</TabsTrigger>
            <TabsTrigger value="builder">Form Builder</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="registration">Registration</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <IntakeDashboard />
          </TabsContent>

          <TabsContent value="forms" className="space-y-4">
            <IntakeForms />
          </TabsContent>

          <TabsContent value="builder" className="space-y-4">
            <FormBuilder />
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <FormTemplates />
          </TabsContent>

          <TabsContent value="registration" className="space-y-4">
            <PatientRegistration />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <IntakeAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default IntakeIQ;
