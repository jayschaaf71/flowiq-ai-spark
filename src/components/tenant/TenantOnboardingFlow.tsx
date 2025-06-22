
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, ArrowRight, ArrowLeft } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  optional?: boolean;
}

interface TenantOnboardingFlowProps {
  tenantId: string;
  onComplete?: () => void;
}

export const TenantOnboardingFlow: React.FC<TenantOnboardingFlowProps> = ({
  tenantId,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'basic-info',
      title: 'Basic Information',
      description: 'Set up your organization details and branding',
      completed: false,
    },
    {
      id: 'team-setup',
      title: 'Team Setup',
      description: 'Invite team members and assign roles',
      completed: false,
    },
    {
      id: 'practice-config',
      title: 'Practice Configuration',
      description: 'Configure appointment types and scheduling',
      completed: false,
    },
    {
      id: 'forms-setup',
      title: 'Intake Forms',
      description: 'Set up patient intake forms and templates',
      completed: false,
      optional: true,
    },
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'Connect your EHR and other systems',
      completed: false,
      optional: true,
    }
  ]);

  const completedSteps = steps.filter(step => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  const handleStepComplete = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    ));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Welcome to FlowIQ</CardTitle>
              <CardDescription>
                Let's get your practice set up in just a few steps
              </CardDescription>
            </div>
            <Badge variant="secondary">
              {completedSteps} of {steps.length} completed
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>
      </Card>

      {/* Steps Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              index === currentStep
                ? 'border-blue-500 bg-blue-50'
                : step.completed
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setCurrentStep(index)}
          >
            <div className="flex-shrink-0">
              {step.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <Circle className={`w-5 h-5 ${index === currentStep ? 'text-blue-600' : 'text-gray-400'}`} />
              )}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">
                {step.title}
                {step.optional && <span className="text-xs text-gray-500 ml-1">(Optional)</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Current Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentStepData.title}
            {currentStepData.optional && (
              <Badge variant="outline" className="text-xs">Optional</Badge>
            )}
          </CardTitle>
          <CardDescription>{currentStepData.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              Step {currentStep + 1} of {steps.length}
            </div>
            <h3 className="text-lg font-semibold mb-2">{currentStepData.title}</h3>
            <p className="text-gray-600 mb-6">{currentStepData.description}</p>
            
            {/* Step-specific content would go here */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600">
                Configuration interface for "{currentStepData.title}" will be implemented here.
              </p>
            </div>

            <div className="flex items-center gap-2 justify-center">
              <Button
                variant="outline"
                onClick={() => handleStepComplete(currentStepData.id)}
                className="px-6"
              >
                Mark as Complete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button onClick={handleNext}>
          {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
          {currentStep < steps.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
};
