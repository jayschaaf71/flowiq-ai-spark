import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { usePatientOnboarding } from '@/hooks/usePatientOnboarding';
import { useAuth } from '@/hooks/useAuth';
import { useCurrentTenant } from '@/utils/enhancedTenantConfig';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  User, 
  Phone, 
  Shield, 
  Heart, 
  Users, 
  FileText, 
  Settings,
  Loader2
} from 'lucide-react';

// Step Components
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { ContactInfoStep } from './steps/ContactInfoStep';
import { InsuranceInfoStep } from './steps/InsuranceInfoStep';
import { MedicalHistoryStep } from './steps/MedicalHistoryStep';
import { EmergencyContactStep } from './steps/EmergencyContactStep';
import { ConsentsStep } from './steps/ConsentsStep';
import { PreferencesStep } from './steps/PreferencesStep';

interface PatientOnboardingFlowProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export const PatientOnboardingFlow: React.FC<PatientOnboardingFlowProps> = ({
  onComplete,
  onSkip
}) => {
  const { user, profile } = useAuth();
  const { currentTenant } = useCurrentTenant();
  const { onboarding, loading, saving, saveStep, updateStepData } = usePatientOnboarding();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Basic personal details',
      icon: User,
      component: PersonalInfoStep
    },
    {
      id: 'contact',
      title: 'Contact Information',
      description: 'How we can reach you',
      icon: Phone,
      component: ContactInfoStep
    },
    {
      id: 'insurance',
      title: 'Insurance Information',
      description: 'Insurance and coverage details',
      icon: Shield,
      component: InsuranceInfoStep
    },
    {
      id: 'medical',
      title: 'Medical History',
      description: 'Health history and medications',
      icon: Heart,
      component: MedicalHistoryStep
    },
    {
      id: 'emergency',
      title: 'Emergency Contact',
      description: 'Emergency contact information',
      icon: Users,
      component: EmergencyContactStep
    },
    {
      id: 'consents',
      title: 'Consents & Agreements',
      description: 'Required agreements and consents',
      icon: FileText,
      component: ConsentsStep
    },
    {
      id: 'preferences',
      title: 'Portal Preferences',
      description: 'Customize your portal experience',
      icon: Settings,
      component: PreferencesStep
    }
  ];

  useEffect(() => {
    if (onboarding && !loading) {
      setCurrentStep(onboarding.step_completed);
    }
  }, [onboarding, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-700">Loading your onboarding...</span>
        </div>
      </div>
    );
  }

  if (onboarding?.is_completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Your Portal!</h2>
            <p className="text-gray-600 mb-6">
              Your onboarding is complete. You can now access all portal features.
            </p>
            <Button onClick={onComplete} className="w-full">
              Continue to Portal
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleNext = async () => {
    const nextStep = currentStep + 1;
    const stepData = getCurrentStepData();
    
    const success = await saveStep(nextStep, stepData, currentTenant?.specialty);
    if (success) {
      if (nextStep >= steps.length) {
        onComplete?.();
      } else {
        setCurrentStep(nextStep);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getCurrentStepData = () => {
    const stepId = steps[currentStep]?.id;
    if (!stepId || !onboarding) return {};

    switch (stepId) {
      case 'personal':
        return { personal_info: onboarding.data.personal_info };
      case 'contact':
        return { contact_info: onboarding.data.contact_info };
      case 'insurance':
        return { insurance_info: onboarding.data.insurance_info };
      case 'medical':
        return { medical_history: onboarding.data.medical_history };
      case 'emergency':
        return { emergency_contact: onboarding.data.emergency_contact };
      case 'consents':
        return { consents: onboarding.data.consents };
      case 'preferences':
        return { portal_preferences: onboarding.data.portal_preferences };
      default:
        return {};
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep]?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to {currentTenant?.name || 'Your Healthcare Portal'}
          </h1>
          <p className="text-gray-600">
            Let's get you set up with a quick onboarding process
          </p>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-sm">
                  Step {currentStep + 1} of {steps.length}
                </Badge>
                <span className="text-sm text-gray-600">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              {onSkip && (
                <Button variant="ghost" size="sm" onClick={onSkip}>
                  Skip for now
                </Button>
              )}
            </div>
            <Progress value={progress} className="h-2 mb-4" />
            
            {/* Step indicators */}
            <div className="flex justify-between text-xs">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div 
                    key={step.id}
                    className={`flex flex-col items-center ${
                      index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span className="hidden sm:block">{step.title}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Current Step */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(steps[currentStep].icon, { className: "w-5 h-5" })}
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription>
              {steps[currentStep].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {CurrentStepComponent && onboarding && (
              <CurrentStepComponent
                data={onboarding.data}
                onUpdate={updateStepData}
                specialty={currentTenant?.specialty}
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};