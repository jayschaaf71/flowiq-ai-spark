
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  AlertCircle, 
  Rocket,
  Database,
  CreditCard,
  FileText,
  Users,
  Bot
} from 'lucide-react';

interface ReviewAndLaunchProps {
  onboardingData: any;
  onSubmit: () => void;
  onCancel: () => void;
}

export const ReviewAndLaunch: React.FC<ReviewAndLaunchProps> = ({
  onboardingData,
  onSubmit,
  onCancel
}) => {
  const configSections = [
    {
      title: 'Practice Information',
      icon: Users,
      data: onboardingData.practiceData,
      isComplete: !!(onboardingData.practiceData?.practiceName && onboardingData.practiceData?.email)
    },
    {
      title: 'AI Agents',
      icon: Bot,
      data: onboardingData.agentConfig,
      isComplete: Object.values(onboardingData.agentConfig || {}).some(v => v === true)
    },
    {
      title: 'Payment Setup',
      icon: CreditCard,
      data: onboardingData.paymentConfig,
      isComplete: onboardingData.paymentConfig?.enablePayments || false
    },
    {
      title: 'EHR Integration',
      icon: Database,
      data: onboardingData.ehrConfig,
      isComplete: onboardingData.ehrConfig?.enableIntegration || false
    },
    {
      title: 'Templates',
      icon: FileText,
      data: onboardingData.templateConfig,
      isComplete: onboardingData.templateConfig?.enableAutoGeneration || false
    }
  ];

  const completedSections = configSections.filter(section => section.isComplete).length;
  const totalSections = configSections.length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Review & Launch</h2>
        <p className="text-gray-600 text-lg">
          Review your configuration and launch your FlowIQ practice management system.
        </p>
      </div>

      {/* Progress Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-blue-900">Setup Progress</h4>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              {completedSections}/{totalSections} Complete
            </Badge>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedSections / totalSections) * 100}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Review */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {configSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title} className={`${section.isComplete ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${section.isComplete ? 'text-green-600' : 'text-gray-400'}`} />
                    <CardTitle className="text-sm">{section.title}</CardTitle>
                  </div>
                  {section.isComplete ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className={`text-xs ${section.isComplete ? 'text-green-700' : 'text-gray-500'}`}>
                  {section.isComplete ? 'Configured and ready' : 'Not configured'}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Validation Results */}
      {onboardingData.validationResults && (
        <Card>
          <CardHeader>
            <CardTitle>Integration Validation Results</CardTitle>
            <CardDescription>Status of your integration tests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(onboardingData.validationResults).map(([key, result]: [string, any]) => (
                result && (
                  <div key={key} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <Badge variant={result.success ? 'default' : 'destructive'}>
                      {result.success ? 'Passed' : 'Failed'}
                    </Badge>
                  </div>
                )
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel Setup
        </Button>
        <Button 
          onClick={onSubmit}
          className="bg-green-600 hover:bg-green-700"
        >
          <Rocket className="w-4 h-4 mr-2" />
          Launch FlowIQ
        </Button>
      </div>
    </div>
  );
};
