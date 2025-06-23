
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
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
import { IntakeFormSeed } from "@/components/intake/IntakeFormSeed";
import { StaffIntakeDashboard } from "@/components/intake/StaffIntakeDashboard";
import { EnhancedAIProcessor } from "@/components/intake/EnhancedAIProcessor";
import { PatientCommunicationCenter } from "@/components/intake/PatientCommunicationCenter";
import { AdminCommunicationDashboard } from "@/components/intake/AdminCommunicationDashboard";
import { AdvancedFormBuilder } from "@/components/intake/AdvancedFormBuilder";
import { IntakeAnalyticsAdvanced } from "@/components/intake/IntakeAnalyticsAdvanced";
import { PatientDataAnalytics } from "@/components/analytics/PatientDataAnalytics";
import { DataExportManager } from "@/components/analytics/DataExportManager";
import { APIManagement } from "@/components/analytics/APIManagement";
import { PatientOnboardingWorkflow } from "@/components/intake/PatientOnboardingWorkflow";
import { useIntakeForms } from "@/hooks/useIntakeForms";
import { useTenantConfig } from "@/utils/tenantConfig";
import { useIntakeSubmissions } from "@/hooks/useIntakeSubmissions";
import { useToast } from "@/hooks/use-toast";

const IntakeIQ = () => {
  const [activeTab, setActiveTab] = useState("staff-dashboard");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const tenantConfig = useTenantConfig();
  const { submissions } = useIntakeForms();
  const { sendCommunication } = useIntakeSubmissions();
  const { toast } = useToast();

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

  const handleSendCommunication = (
    submissionId: string,
    templateId: string,
    recipient: string,
    patientName: string,
    customMessage?: string,
    type: 'email' | 'sms' = 'email'
  ) => {
    sendCommunication(submissionId, templateId, recipient, patientName, customMessage, type);
  };

  const handleStartOnboarding = () => {
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = (patientId: string) => {
    setShowOnboarding(false);
    toast({
      title: "Patient Onboarding Complete",
      description: "Patient has been successfully registered and can now book appointments.",
    });
  };

  const handleOnboardingCancel = () => {
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return (
      <div className="space-y-6">
        <PatientOnboardingWorkflow
          onComplete={handleOnboardingComplete}
          onCancel={handleOnboardingCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Seed component to create initial forms */}
      <IntakeFormSeed />
      
      <PageHeader 
        title="Intake IQ"
        subtitle={`AI-powered ${tenantConfig.specialty.toLowerCase()} patient intake and form management`}
        badge="AI Agent"
      >
        <Button onClick={handleStartOnboarding} className="bg-blue-600 hover:bg-blue-700">
          <User className="w-4 h-4 mr-2" />
          New Patient Onboarding
        </Button>
      </PageHeader>
      
      <div className="p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="staff-dashboard">Staff Dashboard</TabsTrigger>
            <TabsTrigger value="ai-processing">AI Processing</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
            <TabsTrigger value="forms">Form Management</TabsTrigger>
            <TabsTrigger value="patient-portal">Patient Portal</TabsTrigger>
          </TabsList>

          <TabsContent value="staff-dashboard" className="space-y-4">
            <StaffIntakeDashboard />
          </TabsContent>

          <TabsContent value="ai-processing" className="space-y-4">
            <EnhancedAIProcessor />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Tabs defaultValue="patient-data" className="space-y-4">
              <TabsList>
                <TabsTrigger value="patient-data">Patient Analytics</TabsTrigger>
                <TabsTrigger value="data-export">Data Export/Import</TabsTrigger>
                <TabsTrigger value="api-management">API Management</TabsTrigger>
              </TabsList>
              
              <TabsContent value="patient-data">
                <PatientDataAnalytics />
              </TabsContent>
              
              <TabsContent value="data-export">
                <DataExportManager />
              </TabsContent>
              
              <TabsContent value="api-management">
                <APIManagement />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="communications" className="space-y-4">
            <AdminCommunicationDashboard 
              onSendCommunication={handleSendCommunication}
            />
          </TabsContent>

          <TabsContent value="forms" className="space-y-4">
            <Tabs defaultValue="templates" className="space-y-4">
              <TabsList>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="builder">Form Builder</TabsTrigger>
                <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
              </TabsList>
              
              <TabsContent value="templates">
                <FormTemplates />
              </TabsContent>
              
              <TabsContent value="builder">
                <IntakeFormBuilder />
              </TabsContent>
              
              <TabsContent value="ai-tools">
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
            </Tabs>
          </TabsContent>

          <TabsContent value="patient-portal" className="space-y-4">
            <Tabs defaultValue="all-forms" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all-forms">All Forms</TabsTrigger>
                <TabsTrigger value="pregnancy">Pregnancy</TabsTrigger>
                <TabsTrigger value="new-patient">New Patient</TabsTrigger>
                <TabsTrigger value="menstrual">Menstrual History</TabsTrigger>
                <TabsTrigger value="credit-card">Payment Info</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all-forms">
                <PatientRegistration />
              </TabsContent>
              
              <TabsContent value="pregnancy">
                <PregnancyQuestionnaire />
              </TabsContent>
              
              <TabsContent value="new-patient">
                <NewPatientIntakeForm />
              </TabsContent>
              
              <TabsContent value="menstrual">
                <MenstrualHistoryForm />
              </TabsContent>
              
              <TabsContent value="credit-card">
                <CreditCardAgreementForm />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default IntakeIQ;
