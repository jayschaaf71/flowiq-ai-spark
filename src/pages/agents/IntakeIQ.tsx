
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedIntakeDashboard } from "@/components/intake/EnhancedIntakeDashboard";
import { FormSubmissionsList } from "@/components/intake/FormSubmissionsList";
import { IntakeFormBuilder } from "@/components/intake/IntakeFormBuilder";
import { FormTemplates } from "@/components/intake/FormTemplates";
import { PatientRegistration } from "@/components/intake/PatientRegistration";
import { IntakeAnalytics } from "@/components/intake/IntakeAnalytics";
import { IntakeAIProcessor } from "@/components/intake/IntakeAIProcessor";
import { SmartFormBuilder } from "@/components/intake/SmartFormBuilder";
import { PregnancyQuestionnaire } from "@/components/intake/PregnancyQuestionnaire";
import { NewPatientIntakeForm } from "@/components/intake/NewPatientIntakeForm";
import { MenstrualHistoryForm } from "@/components/intake/MenstrualHistoryForm";
import { useIntakeForms } from "@/hooks/useIntakeForms";
import { useTenantConfig } from "@/utils/tenantConfig";

const IntakeIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const tenantConfig = useTenantConfig();
  const { submissions } = useIntakeForms();

  const handleViewSubmission = (submission: any) => {
    console.log('Viewing submission:', submission);
    // TODO: Implement submission detail modal or navigation
  };

  return (
    <Layout>
      <PageHeader 
        title={`${tenantConfig.brandName} Intake iQ`}
        subtitle={`AI-powered ${tenantConfig.specialty.toLowerCase()} patient intake and form management`}
        badge="AI Agent"
      />
      
      <div className="p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-11">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="ai-processing">AI Processing</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="smart-builder">Smart Builder</TabsTrigger>
            <TabsTrigger value="builder">Form Builder</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="pregnancy">Pregnancy Form</TabsTrigger>
            <TabsTrigger value="menstrual">Menstrual History</TabsTrigger>
            <TabsTrigger value="new-patient">New Patient</TabsTrigger>
            <TabsTrigger value="registration">Patient Portal</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <EnhancedIntakeDashboard />
          </TabsContent>

          <TabsContent value="ai-processing" className="space-y-4">
            <IntakeAIProcessor />
          </TabsContent>

          <TabsContent value="submissions" className="space-y-4">
            <FormSubmissionsList 
              submissions={submissions} 
              onViewSubmission={handleViewSubmission}
            />
          </TabsContent>

          <TabsContent value="smart-builder" className="space-y-4">
            <SmartFormBuilder />
          </TabsContent>

          <TabsContent value="builder" className="space-y-4">
            <IntakeFormBuilder />
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <FormTemplates />
          </TabsContent>

          <TabsContent value="pregnancy" className="space-y-4">
            <PregnancyQuestionnaire />
          </TabsContent>

          <TabsContent value="menstrual" className="space-y-4">
            <MenstrualHistoryForm />
          </TabsContent>

          <TabsContent value="new-patient" className="space-y-4">
            <NewPatientIntakeForm />
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
