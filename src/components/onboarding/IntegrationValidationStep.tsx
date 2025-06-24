
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  RefreshCw,
  Database,
  CreditCard,
  FileText,
  ExternalLink
} from 'lucide-react';
import { IntegrationValidator, IntegrationValidationResults, ValidationResult } from '@/services/integrationValidation';
import { useToast } from '@/hooks/use-toast';

interface IntegrationValidationStepProps {
  onboardingData: any;
  onValidationComplete: (results: IntegrationValidationResults) => void;
  onSkip: () => void;
}

export const IntegrationValidationStep: React.FC<IntegrationValidationStepProps> = ({
  onboardingData,
  onValidationComplete,
  onSkip
}) => {
  const [validationResults, setValidationResults] = useState<IntegrationValidationResults>({
    ehrIntegration: null,
    paymentProcessor: null,
    templateGeneration: null
  });
  const [isValidating, setIsValidating] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);
  const { toast } = useToast();

  const integrationItems = [
    {
      key: 'ehrIntegration' as keyof IntegrationValidationResults,
      name: 'EHR Integration',
      description: 'Electronic Health Records connection',
      icon: Database,
      enabled: onboardingData.ehrConfig?.enableIntegration,
      config: onboardingData.ehrConfig
    },
    {
      key: 'paymentProcessor' as keyof IntegrationValidationResults,
      name: 'Payment Processing',
      description: 'Payment gateway and billing setup',
      icon: CreditCard,
      enabled: onboardingData.paymentConfig?.enablePayments,
      config: onboardingData.paymentConfig
    },
    {
      key: 'templateGeneration' as keyof IntegrationValidationResults,
      name: 'Template Generation',
      description: 'Specialty-specific form templates',
      icon: FileText,
      enabled: onboardingData.templateConfig?.enableAutoGeneration,
      config: onboardingData.templateConfig
    }
  ];

  const enabledIntegrations = integrationItems.filter(item => item.enabled);

  const runValidation = async () => {
    if (enabledIntegrations.length === 0) {
      toast({
        title: "No integrations to validate",
        description: "Skip this step or enable integrations in previous steps.",
      });
      return;
    }

    setIsValidating(true);
    setValidationProgress(0);

    try {
      const results = await IntegrationValidator.validateAllIntegrations(onboardingData);
      setValidationResults(results);
      onValidationComplete(results);
      
      const successCount = Object.values(results).filter(result => result?.success).length;
      const totalEnabled = enabledIntegrations.length;
      
      toast({
        title: "Validation Complete",
        description: `${successCount}/${totalEnabled} integrations validated successfully.`,
      });
    } catch (error) {
      console.error('Validation error:', error);
      toast({
        title: "Validation Error",
        description: "Failed to validate integrations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
      setValidationProgress(100);
    }
  };

  const getValidationStatus = (result: ValidationResult | null) => {
    if (!result) return 'pending';
    return result.success ? 'success' : 'error';
  };

  const getStatusIcon = (result: ValidationResult | null) => {
    if (isValidating && !result) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (!result) return <div className="w-4 h-4 rounded-full bg-gray-300" />;
    return result.success 
      ? <CheckCircle2 className="w-4 h-4 text-green-600" />
      : <AlertCircle className="w-4 h-4 text-red-600" />;
  };

  const getStatusBadge = (result: ValidationResult | null) => {
    if (!result) return <Badge variant="secondary">Pending</Badge>;
    return result.success 
      ? <Badge className="bg-green-100 text-green-800">Connected</Badge>
      : <Badge variant="destructive">Failed</Badge>;
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

      {/* Validation Progress */}
      {isValidating && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Validating integrations...</p>
                <Progress value={validationProgress} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integration Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrationItems.map((item) => {
          const Icon = item.icon;
          const result = validationResults[item.key];
          
          if (!item.enabled) {
            return (
              <Card key={item.key} className="opacity-60">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-gray-400" />
                      <CardTitle className="text-sm">{item.name}</CardTitle>
                    </div>
                    <Badge variant="outline">Disabled</Badge>
                  </div>
                  <CardDescription className="text-xs">{item.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          }

          return (
            <Card key={item.key} className={`transition-colors ${
              result?.success ? 'border-green-200 bg-green-50' :
              result && !result.success ? 'border-red-200 bg-red-50' : ''
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    <CardTitle className="text-sm">{item.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result)}
                    {getStatusBadge(result)}
                  </div>
                </div>
                <CardDescription className="text-xs">{item.description}</CardDescription>
              </CardHeader>
              
              {result && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <p className={`text-xs font-medium ${
                      result.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {result.message}
                    </p>
                    
                    {result.details && (
                      <div className="text-xs text-gray-600 space-y-1">
                        {Object.entries(result.details).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                            <span className="font-mono">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* No Integrations Enabled */}
      {enabledIntegrations.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500 mb-4">
              <ExternalLink className="w-12 h-12 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">No Integrations Enabled</h3>
              <p className="text-sm">
                You haven't enabled any integrations that require validation. 
                You can skip this step or go back to enable integrations.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6">
        <Button variant="outline" onClick={onSkip}>
          Skip Validation
        </Button>
        
        <div className="flex gap-3">
          {hasValidationResults && (
            <Button 
              variant="outline" 
              onClick={runValidation}
              disabled={isValidating}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Re-validate
            </Button>
          )}
          
          <Button 
            onClick={runValidation}
            disabled={isValidating || enabledIntegrations.length === 0}
          >
            {isValidating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Validating...
              </>
            ) : hasValidationResults ? (
              'Continue'
            ) : (
              'Start Validation'
            )}
          </Button>
        </div>
      </div>

      {/* Summary Status */}
      {hasValidationResults && (
        <Card className={`mt-4 ${allValidationsSuccessful ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {allValidationsSuccessful ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              )}
              <div>
                <p className={`text-sm font-medium ${allValidationsSuccessful ? 'text-green-800' : 'text-yellow-800'}`}>
                  {allValidationsSuccessful 
                    ? 'All integrations validated successfully!' 
                    : 'Some integrations need attention before going live.'
                  }
                </p>
                <p className={`text-xs ${allValidationsSuccessful ? 'text-green-700' : 'text-yellow-700'}`}>
                  {allValidationsSuccessful 
                    ? 'Your practice is ready to start using these integrations.' 
                    : 'Review the failed validations and fix any issues before proceeding.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
