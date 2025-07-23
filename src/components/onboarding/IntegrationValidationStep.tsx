
import React, { useState } from 'react';
import { 
  Database,
  CreditCard,
  FileText
} from 'lucide-react';
import { ValidationProgressCard } from './validation/ValidationProgressCard';
import { IntegrationStatusCard } from './validation/IntegrationStatusCard';
import { ValidationSummaryCard } from './validation/ValidationSummaryCard';
import { ValidationActionButtons } from './validation/ValidationActionButtons';
import { NoIntegrationsCard } from './validation/NoIntegrationsCard';

import { OnValidationCompleteCallback } from '@/types/callbacks';
import { OnboardingCompletionData } from '@/types/onboarding';

interface IntegrationValidationStepProps {
  onboardingData: OnboardingCompletionData;
  onValidationComplete: OnValidationCompleteCallback;
  onSkip: () => void;
}

export const IntegrationValidationStep: React.FC<IntegrationValidationStepProps> = ({
  onboardingData,
  onValidationComplete,
  onSkip
}) => {
  const [validationResults, setValidationResults] = useState<any>({
    ehrIntegration: null,
    paymentProcessor: null,
    templateGeneration: null
  });
  const [isValidating, setIsValidating] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);

  const integrationItems = [
    {
      key: 'ehrIntegration',
      name: 'EHR Integration',
      description: 'Electronic Health Records connection',
      icon: Database,
      enabled: Boolean(onboardingData.ehrConfig?.enableIntegration),
      config: onboardingData.ehrConfig
    },
    {
      key: 'paymentProcessor',
      name: 'Payment Processing',
      description: 'Payment gateway and billing setup',
      icon: CreditCard,
      enabled: Boolean(onboardingData.paymentConfig?.enablePayments),
      config: onboardingData.paymentConfig
    },
    {
      key: 'templateGeneration',
      name: 'Template Generation',
      description: 'Specialty-specific form templates',
      icon: FileText,
      enabled: Boolean(onboardingData.templateConfig?.enableAutoGeneration),
      config: onboardingData.templateConfig
    }
  ];

  const enabledIntegrations = integrationItems.filter(item => item.enabled);

  const runValidation = async () => {
    if (enabledIntegrations.length === 0) {
      return;
    }

    setIsValidating(true);
    setValidationProgress(0);

    try {
      const results: any = {};
      
      for (let i = 0; i < enabledIntegrations.length; i++) {
        const integration = enabledIntegrations[i];
        setValidationProgress(((i + 0.5) / enabledIntegrations.length) * 100);
        
        // Simulate validation logic
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock validation results
        const success = Math.random() > 0.3; // 70% success rate
        results[integration.key] = {
          success,
          message: success 
            ? `${integration.name} connected successfully`
            : `Failed to connect to ${integration.name}`,
          details: success ? {
            status: 'Connected',
            lastSync: new Date().toISOString(),
            version: '1.0.0'
          } : {
            error: 'Connection timeout',
            suggestion: 'Check API credentials'
          }
        };
        
        setValidationResults(prev => ({ ...prev, ...results }));
        setValidationProgress(((i + 1) / enabledIntegrations.length) * 100);
      }

      onValidationComplete(results);
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const hasValidationResults = Object.values(validationResults).some(result => result !== null);
  const allValidationsSuccessful = enabledIntegrations.every(item => 
    validationResults[item.key]?.success === true
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Integration Validation</h2>
        <p className="text-gray-600">
          Let's test your integrations to make sure everything is working properly before you go live.
        </p>
      </div>

      <ValidationProgressCard 
        isValidating={isValidating}
        validationProgress={validationProgress}
      />

      {/* Integration Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrationItems.map((item) => (
          <IntegrationStatusCard
            key={item.key}
            item={item}
            result={validationResults[item.key]}
            isValidating={isValidating}
          />
        ))}
      </div>

      {/* No Integrations Enabled */}
      {enabledIntegrations.length === 0 && <NoIntegrationsCard />}

      <ValidationActionButtons
        onSkip={onSkip}
        onValidate={runValidation}
        isValidating={isValidating}
        hasValidationResults={hasValidationResults}
        enabledIntegrationsCount={enabledIntegrations.length}
      />

      <ValidationSummaryCard
        hasValidationResults={hasValidationResults}
        allValidationsSuccessful={allValidationsSuccessful}
      />
    </div>
  );
};
