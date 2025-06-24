
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Database, 
  CreditCard, 
  FileText, 
  Settings,
  ExternalLink
} from 'lucide-react';

interface IntegrationPreviewProps {
  onboardingData: any;
}

export const IntegrationPreview: React.FC<IntegrationPreviewProps> = ({ onboardingData }) => {
  const previewEHRConnection = () => {
    // Mock EHR preview
    console.log('Previewing EHR connection:', onboardingData.ehrConfig);
  };

  const previewPaymentFlow = () => {
    // Mock payment flow preview
    console.log('Previewing payment flow:', onboardingData.paymentConfig);
  };

  const previewTemplates = () => {
    // Mock template preview
    console.log('Previewing templates:', onboardingData.templateConfig);
  };

  const integrationPreviews = [
    {
      name: 'EHR Integration Preview',
      description: 'See how patient data will sync with your EHR system',
      icon: Database,
      enabled: onboardingData.ehrConfig?.enableIntegration,
      action: previewEHRConnection,
      details: onboardingData.ehrConfig ? {
        system: onboardingData.ehrConfig.ehrSystem,
        endpoint: onboardingData.ehrConfig.apiEndpoint,
        dataSync: 'Real-time patient records'
      } : null
    },
    {
      name: 'Payment Processing Preview',
      description: 'Test a sample payment transaction',
      icon: CreditCard,
      enabled: onboardingData.paymentConfig?.enablePayments,
      action: previewPaymentFlow,
      details: onboardingData.paymentConfig ? {
        processor: onboardingData.paymentConfig.processor || 'Stripe',
        currency: onboardingData.paymentConfig.currency || 'USD',
        testMode: 'Sandbox environment'
      } : null
    },
    {
      name: 'Template Generation Preview',
      description: 'See your specialty-specific forms and templates',
      icon: FileText,
      enabled: onboardingData.templateConfig?.enableAutoGeneration,
      action: previewTemplates,
      details: onboardingData.templateConfig ? {
        specialty: onboardingData.specialty,
        templates: 'Intake forms, SOAP notes, Treatment plans',
        customization: onboardingData.templateConfig.customizationPreferences?.includeBranding ? 'Branded' : 'Standard'
      } : null
    }
  ];

  const enabledPreviews = integrationPreviews.filter(preview => preview.enabled);

  if (enabledPreviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-500 mb-4">
            <Settings className="w-12 h-12 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">No Integrations to Preview</h3>
            <p className="text-sm">
              Enable integrations in the previous steps to see preview options here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Integration Previews</h3>
        <p className="text-sm text-gray-600">
          Test your integrations before going live to ensure everything works as expected.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrationPreviews.map((preview) => {
          const Icon = preview.icon;
          
          if (!preview.enabled) return null;

          return (
            <Card key={preview.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-sm">{preview.name}</CardTitle>
                  </div>
                  <Badge variant="secondary">
                    <Eye className="w-3 h-3 mr-1" />
                    Preview
                  </Badge>
                </div>
                <CardDescription className="text-xs">{preview.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {preview.details && (
                  <div className="space-y-2">
                    {Object.entries(preview.details).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-xs">
                        <span className="text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}:
                        </span>
                        <span className="font-medium text-gray-900 text-right ml-2">
                          {String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={preview.action}
                  className="w-full"
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  Launch Preview
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
