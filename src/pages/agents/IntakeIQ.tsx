
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
import { IntakeFormSeed } from "@/components/intake/IntakeFormSeed";
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

  // Redirect to Dental Sleep iQ
  return <DentalSleepRedirect />;
};

export default IntakeIQ;
