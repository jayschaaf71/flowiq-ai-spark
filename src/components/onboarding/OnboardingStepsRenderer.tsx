
import React from 'react';
import { PracticeSpecialty } from './PracticeSpecialty';
import { PracticeDetails } from './PracticeDetails';
import { TeamConfiguration } from './TeamConfiguration';
import { AgentConfiguration } from './AgentConfiguration';
import { ScribeAgentConfiguration } from './ScribeAgentConfiguration';
import { OnboardingPaymentStep } from './OnboardingPaymentStep';
import { EHRConfiguration } from './EHRConfiguration';
import { TemplateConfiguration } from './TemplateConfiguration';
import { ReviewAndLaunch } from './ReviewAndLaunch';
import { IntegrationValidationStep } from './IntegrationValidationStep';
import { OnboardingData } from '@/hooks/useOnboardingFlow';
import { SpecialtyType } from '@/utils/specialtyConfig';

interface OnboardingStepsRendererProps {
  currentStep: {
    component: string;
  };
  onboardingData: OnboardingData;
  updateOnboardingData: (updates: Partial<OnboardingData>) => void;
  nextStep: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const OnboardingStepsRenderer: React.FC<OnboardingStepsRendererProps> = ({
  currentStep,
  onboardingData,
  updateOnboardingData,
  nextStep,
  onSubmit,
  onCancel
}) => {
  const defaultSpecialty: SpecialtyType = 'chiropractic';

  switch (currentStep.component) {
    case 'specialty':
      return (
        <PracticeSpecialty
          specialty={onboardingData.specialty || null}
          onSpecialtySelect={(specialty) => updateOnboardingData({ specialty })}
        />
      );

    case 'practice':
      return (
        <PracticeDetails
          practiceData={onboardingData.practiceData}
          onPracticeDetailsUpdate={(practiceData) => updateOnboardingData({ practiceData })}
        />
      );

    case 'team':
      return (
        <TeamConfiguration
          specialty={onboardingData.specialty || defaultSpecialty}
          teamConfig={onboardingData.teamConfig}
          onTeamConfigUpdate={(teamConfig) => updateOnboardingData({ teamConfig })}
        />
      );

    case 'agents':
      return (
        <AgentConfiguration
          agentConfig={onboardingData.agentConfig || { receptionistAgent: false, schedulingAgent: false, billingAgent: false }}
          onAgentConfigUpdate={(agentConfig) => updateOnboardingData({ agentConfig })}
        />
      );

    case 'scribe':
      return (
        <ScribeAgentConfiguration
          currentConfig={onboardingData.scribeConfig}
          onConfigUpdate={(scribeConfig) => updateOnboardingData({ scribeConfig })}
        />
      );

    case 'payment':
      return (
        <OnboardingPaymentStep
          specialty={onboardingData.specialty || defaultSpecialty}
          currentConfig={onboardingData.paymentConfig}
          onStepComplete={(stepData) => {
            updateOnboardingData({ paymentConfig: stepData.data });
            nextStep();
          }}
          onSkipStep={() => {
            updateOnboardingData({ 
              paymentConfig: { 
                enablePayments: false, 
                subscriptionPlan: 'professional' 
              }
            });
            nextStep();
          }}
        />
      );

    case 'ehr':
      return (
        <EHRConfiguration
          specialty={onboardingData.specialty || defaultSpecialty}
          ehrConfig={onboardingData.ehrConfig || { enableIntegration: false, ehrSystem: '', apiEndpoint: '' }}
          onEHRConfigUpdate={(ehrConfig) => updateOnboardingData({ ehrConfig })}
        />
      );

    case 'templates':
      return (
        <TemplateConfiguration
          specialty={onboardingData.specialty || defaultSpecialty}
          templateConfig={onboardingData.templateConfig}
          onTemplateConfigUpdate={(templateConfig) => updateOnboardingData({ templateConfig })}
        />
      );

    case 'validation':
      return (
        <IntegrationValidationStep
          onboardingData={onboardingData}
          onValidationComplete={(results) => {
            console.log('Integration validation results:', results);
            updateOnboardingData({ validationResults: results });
          }}
          onSkip={() => {
            console.log('Skipping integration validation');
            nextStep();
          }}
        />
      );

    case 'review':
      return (
        <ReviewAndLaunch
          onboardingData={onboardingData}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      );

    default:
      return <div>Unknown step</div>;
  }
};
