
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IntakeDashboard } from "@/components/intake/IntakeDashboard";
import { EnhancedIntakeDashboard } from "@/components/intake/EnhancedIntakeDashboard";
import { StaffIntakeDashboard } from "@/components/intake/StaffIntakeDashboard";
import { PatientRegistration } from "@/components/intake/PatientRegistration";
import { FormBuilder } from "@/components/intake/FormBuilder";
import { FormSubmissionsList } from "@/components/intake/FormSubmissionsList";
import { IntakeAnalyticsDashboard } from "@/components/intake/IntakeAnalyticsDashboard";
import { EnhancedAnalyticsDashboard } from "@/components/intake/EnhancedAnalyticsDashboard";
import { VoiceEnabledPatientIntake } from "@/components/intake/VoiceEnabledPatientIntake";
import { MobileVoiceIntake } from "@/components/intake/MobileVoiceIntake";
import { useIntakeForms } from "@/hooks/useIntakeForms";

const IntakeIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { forms, submissions, loading } = useIntakeForms();

  // Listen for tab change events from dashboard buttons
  useState(() => {
    const handleTabChange = (event: CustomEvent) => {
      setActiveTab(event.detail);
    };

    window.addEventListener('changeIntakeTab', handleTabChange as EventListener);
    return () => {
      window.removeEventListener('changeIntakeTab', handleTabChange as EventListener);
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Intake iQ"
        subtitle="AI-driven patient intake and form processing"
        badge="AI"
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="patient-intake">Patient Intake</TabsTrigger>
          <TabsTrigger value="voice-intake">Voice Intake</TabsTrigger>
          <TabsTrigger value="mobile-voice">Mobile Voice</TabsTrigger>
          <TabsTrigger value="staff-dashboard">Staff View</TabsTrigger>
          <TabsTrigger value="builder">Form Builder</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <EnhancedIntakeDashboard />
        </TabsContent>

        <TabsContent value="patient-intake" className="space-y-4">
          <PatientRegistration />
        </TabsContent>

        <TabsContent value="voice-intake" className="space-y-4">
          <VoiceEnabledPatientIntake />
        </TabsContent>

        <TabsContent value="mobile-voice" className="space-y-4">
          <MobileVoiceIntake />
        </TabsContent>

        <TabsContent value="staff-dashboard" className="space-y-4">
          <StaffIntakeDashboard />
        </TabsContent>

        <TabsContent value="builder" className="space-y-4">
          <FormBuilder />
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <FormSubmissionsList 
            submissions={submissions}
            onViewSubmission={(submission) => console.log('View submission:', submission)}
            showActions={true}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <EnhancedAnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntakeIQ;
