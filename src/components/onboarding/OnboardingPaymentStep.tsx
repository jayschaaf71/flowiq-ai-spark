
import React from 'react';
import { PaymentSetupStep } from './PaymentSetupStep';
import { SpecialtyType } from '@/utils/specialtyConfig';

interface OnboardingPaymentStepProps {
  specialty: SpecialtyType;
  currentConfig?: {
    enablePayments: boolean;
    subscriptionPlan: string;
  };
  onStepComplete: (stepData: any) => void;
  onSkipStep: () => void;
}

export const OnboardingPaymentStep: React.FC<OnboardingPaymentStepProps> = ({
  specialty,
  currentConfig,
  onStepComplete,
  onSkipStep
}) => {
  const handlePaymentComplete = (paymentConfig: any) => {
    // Structure the data for the onboarding flow
    const stepData = {
      stepId: 'payment_setup',
      completed: true,
      data: {
        paymentConfig,
        enablePayments: paymentConfig.enablePayments,
        subscriptionPlan: paymentConfig.subscriptionPlan || 'professional'
      }
    };
    
    onStepComplete(stepData);
  };

  const handleSkip = () => {
    const stepData = {
      stepId: 'payment_setup',
      completed: false,
      skipped: true,
      data: {
        enablePayments: false,
        subscriptionPlan: 'professional'
      }
    };
    
    onStepComplete(stepData);
  };

  return (
    <PaymentSetupStep
      specialty={specialty}
      initialConfig={currentConfig}
      onComplete={handlePaymentComplete}
      onSkip={handleSkip}
    />
  );
};
