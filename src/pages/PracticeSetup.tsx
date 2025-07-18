
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SetupLayout } from "@/components/SetupLayout";
import { SetupPageHeader } from "@/components/setup/SetupPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { PracticeTypeStep } from "@/components/setup/PracticeTypeStep";
import { BasicInfoStep } from "@/components/setup/BasicInfoStep";
import { AgentSelectionStep } from "@/components/setup/AgentSelectionStep";
import { IntegrationStep } from "@/components/setup/IntegrationStep";
import { ReviewStep } from "@/components/setup/ReviewStep";
import { usePracticeSetupPersistence } from "@/hooks/usePracticeSetupPersistence";
import { supabase } from "@/integrations/supabase/client";

export type PracticeType = 'dental' | 'orthodontics' | 'oral-surgery' | 'dental-sleep' | 'chiropractic' | 'physical-therapy' | 'veterinary' | 'med-spa' | 'communication-iq';

export interface SetupData {
  practiceType: PracticeType | null;
  practiceName: string;
  address: string;
  phone: string;
  email: string;
  selectedAgents: string[];
  integrations: {
    calendar: boolean;
    sms: boolean;
    email: boolean;
    payments: boolean;
  };
}

const PracticeSetup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [setupData, setSetupData] = useState<SetupData>({
    practiceType: null,
    practiceName: '',
    address: '',
    phone: '',
    email: '',
    selectedAgents: [],
    integrations: {
      calendar: false,
      sms: false,
      email: false,
      payments: false,
    },
  });

  // Add persistence hooks with callback to know when data is loaded
  const { clearSavedData, hasSavedData } = usePracticeSetupPersistence(
    setupData, 
    setSetupData, 
    currentStep, 
    setCurrentStep,
    () => setIsDataLoaded(true)
  );

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    { number: 1, title: "Practice Type", description: "What type of practice do you run?" },
    { number: 2, title: "Basic Information", description: "Tell us about your practice" },
    { number: 3, title: "AI Agents", description: "Choose which AI agents to activate" },
    { number: 4, title: "Integrations", description: "Connect your existing tools" },
    { number: 5, title: "Review & Launch", description: "Review your setup and launch FlowIQ" },
  ];

  const updateSetupData = (updates: Partial<SetupData>) => {
    setSetupData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return setupData.practiceType !== null;
      case 2:
        return setupData.practiceName && setupData.phone && setupData.email;
      case 3:
        return setupData.selectedAgents.length > 0;
      case 4:
        return true; // Integrations are optional
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleComplete = async () => {
    console.log('Setup completed with data:', setupData);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (setupData.practiceType && setupData.practiceName) {
        // Generate subdomain from practice name
        const subdomain = setupData.practiceName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
          .substring(0, 50);

        const specialtyMapping = {
          'dental-sleep': 'dental-sleep-medicine',
          'dental': 'dental-care', 
          'orthodontics': 'orthodontics',
          'oral-surgery': 'oral-surgery',
          'chiropractic': 'chiropractic-care',
          'physical-therapy': 'physical-therapy',
          'veterinary': 'veterinary-medicine',
          'med-spa': 'medical-spa',
          'communication-iq': 'patient-communication'
        };

        // Create tenant using the database function
        const { data: tenantId, error: tenantError } = await supabase
          .rpc('create_tenant_from_onboarding', {
            p_name: setupData.practiceName,
            p_subdomain: subdomain,
            p_specialty: specialtyMapping[setupData.practiceType] || setupData.practiceType,
            p_practice_type: setupData.practiceType,
            p_business_name: setupData.practiceName,
            p_address: setupData.address,
            p_phone: setupData.phone,
            p_email: setupData.email
          });

        if (tenantError) {
          console.error('Failed to create tenant:', tenantError);
          throw tenantError;
        }

        console.log('Created tenant with ID:', tenantId);

        // Update user's specialty in localStorage - use the same key as other components
        localStorage.setItem('currentSpecialty', specialtyMapping[setupData.practiceType] || setupData.practiceType);
      }
    } catch (error) {
      console.error('Failed to complete setup:', error);
      // You might want to show an error message to the user here
      return;
    }
    
    // Clear saved data BEFORE setting completion to prevent restoration on redirect
    clearSavedData();
    setIsCompleted(true);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PracticeTypeStep setupData={setupData} updateSetupData={updateSetupData} />;
      case 2:
        return <BasicInfoStep setupData={setupData} updateSetupData={updateSetupData} />;
      case 3:
        return <AgentSelectionStep setupData={setupData} updateSetupData={updateSetupData} />;
      case 4:
        return <IntegrationStep setupData={setupData} updateSetupData={updateSetupData} />;
      case 5:
        return <ReviewStep setupData={setupData} onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  if (isCompleted) {
    return (
      <SetupLayout>
        <div className="min-h-screen flex items-center justify-center p-6">
          <Card className="max-w-md w-full text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Setup Complete!</CardTitle>
              <CardDescription>
                FlowIQ is now configured for your practice. Your AI agents are ready to start automating your workflows.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => {
                  // Force clear any remaining saved data (both user-specific and legacy)
                  clearSavedData();
                  // Use React Router navigation instead of window.location
                  navigate('/dashboard');
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </SetupLayout>
    );
  }

  return (
    <SetupLayout>
      <SetupPageHeader 
        title="Practice Setup"
        subtitle="Let's get FlowIQ configured for your practice"
      />
      
      <div className="p-6 max-w-4xl mx-auto">
        {/* Show saved data notice if exists */}
        {hasSavedData() && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <p className="text-blue-800 font-medium">
                We've saved your progress! You can continue where you left off.
              </p>
            </div>
          </div>
        )}
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps Navigation */}
        <div className="flex justify-between mb-8 overflow-x-auto">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center min-w-0 flex-1 px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                step.number < currentStep 
                  ? 'bg-green-500 text-white' 
                  : step.number === currentStep 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
              }`}>
                {step.number < currentStep ? <CheckCircle className="w-4 h-4" /> : step.number}
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-gray-900 truncate">{step.title}</div>
                <div className="text-xs text-gray-500 hidden sm:block">{step.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-6">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={currentStep === totalSteps ? handleComplete : nextStep}
            disabled={!canProceed()}
            className="bg-gradient-to-r from-blue-500 to-purple-500"
          >
            {currentStep === totalSteps ? 'Complete Setup' : 'Next'}
            {currentStep !== totalSteps && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </SetupLayout>
  );
};

export default PracticeSetup;
