
import { useState, useEffect } from "react";
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
import { CreditCardAgreementForm } from "@/components/intake/CreditCardAgreementForm";
import { useIntakeForms } from "@/hooks/useIntakeForms";
import { useTenantConfig } from "@/utils/tenantConfig";

const IntakeIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const tenantConfig = useTenantConfig();
  const { submissions } = useIntakeForms();

  // Listen for custom events to change tabs
  useEffect(() => {
    const handleTabChange = (event: CustomEvent) => {
      setActiveTab(event.detail);
    };

    window.addEventListener('changeIntakeTab', handleTabChange as EventListener);
    
    return () => {
      window.removeEventListener('changeIntakeTab', handleTabChange as EventListener);
    };
  }, []);

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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
            <TabsTrigger value="patient-portal">Patient Portal</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <EnhancedIntakeDashboard />
          </TabsContent>

          <TabsContent value="submissions" className="space-y-4">
            <FormSubmissionsList 
              submissions={submissions} 
              onViewSubmission={handleViewSubmission}
            />
          </TabsContent>

          <TabsContent value="forms" className="space-y-4">
            <Tabs defaultValue="templates" className="space-y-4">
              <TabsList>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="builder">Form Builder</TabsTrigger>
                <TabsTrigger value="pregnancy">Pregnancy Form</TabsTrigger>
                <TabsTrigger value="menstrual">Menstrual History</TabsTrigger>
                <TabsTrigger value="new-patient">New Patient</TabsTrigger>
                <TabsTrigger value="credit-card">Credit Card</TabsTrigger>
              </TabsList>
              
              <TabsContent value="templates">
                <FormTemplates />
              </TabsContent>
              
              <TabsContent value="builder">
                <IntakeFormBuilder />
              </TabsContent>
              
              <TabsContent value="pregnancy">
                <PregnancyQuestionnaire />
              </TabsContent>
              
              <TabsContent value="menstrual">
                <MenstrualHistoryForm />
              </TabsContent>
              
              <TabsContent value="new-patient">
                <NewPatientIntakeForm />
              </TabsContent>
              
              <TabsContent value="credit-card">
                <CreditCardAgreementForm />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="ai-tools" className="space-y-4">
            <Tabs defaultValue="processor" className="space-y-4">
              <TabsList>
                <TabsTrigger value="processor">AI Processing</TabsTrigger>
                <TabsTrigger value="smart-builder">Smart Builder</TabsTrigger>
              </TabsList>
              
              <TabsContent value="processor">
                <IntakeAIProcessor />
              </TabsContent>
              
              <TabsContent value="smart-builder">
                <SmartFormBuilder />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="patient-portal" className="space-y-4">
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
