
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IntakeDashboard } from "@/components/intake/IntakeDashboard";
import { EnhancedIntakeDashboard } from "@/components/intake/EnhancedIntakeDashboard";
import { StaffIntakeDashboard } from "@/components/intake/StaffIntakeDashboard";
import { FormBuilder } from "@/components/intake/FormBuilder";
import { FormSubmissionsList } from "@/components/intake/FormSubmissionsList";
import { IntakeAnalyticsDashboard } from "@/components/intake/IntakeAnalyticsDashboard";
import { EnhancedAnalyticsDashboard } from "@/components/intake/EnhancedAnalyticsDashboard";
import { VoiceEnabledPatientIntake } from "@/components/intake/VoiceEnabledPatientIntake";
import { MobileVoiceIntake } from "@/components/intake/MobileVoiceIntake";

import { ConversationalVoiceIntake } from "@/components/intake/ConversationalVoiceIntake";
import { useIntakeForms } from "@/hooks/useIntakeForms";
import { DentalSleepRedirect } from "@/components/DentalSleepRedirect";

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
        subtitle="AI-powered patient intake and form management system"
        badge="AI Agent"
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="builder">Form Builder</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="voice">Voice Intake</TabsTrigger>
          <TabsTrigger value="mobile">Mobile</TabsTrigger>
          <TabsTrigger value="staff">Staff View</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <IntakeDashboard />
        </TabsContent>

        <TabsContent value="builder" className="space-y-4">
          <FormBuilder />
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <FormSubmissionsList 
            submissions={submissions} 
            onViewSubmission={(submission) => console.log('View submission:', submission)}
          />
          <IntakeAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="voice" className="space-y-4">
          <VoiceEnabledPatientIntake />
        </TabsContent>

        <TabsContent value="mobile" className="space-y-4">
          <MobileVoiceIntake />
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <StaffIntakeDashboard />
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default IntakeIQ;
