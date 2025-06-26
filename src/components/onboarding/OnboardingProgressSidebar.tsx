
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Circle } from 'lucide-react';

interface OnboardingProgressSidebarProps {
  currentStep: number;
  steps: Array<{ id: string; title: string; component: string }>;
  onboardingData: any;
}

export const OnboardingProgressSidebar: React.FC<OnboardingProgressSidebarProps> = ({
  currentStep,
  steps,
  onboardingData
}) => {
  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'current':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getCompletionStats = () => {
    const completed = currentStep;
    const total = steps.length;
    const percentage = Math.round((completed / total) * 100);
    
    return { completed, total, percentage };
  };

  const stats = getCompletionStats();

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center justify-between">
          Setup Progress
          <Badge variant="secondary" className="text-xs">
            {stats.percentage}%
          </Badge>
        </CardTitle>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          return (
            <div
              key={step.id}
              className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                status === 'current' 
                  ? 'bg-blue-50 border border-blue-200' 
                  : status === 'completed'
                  ? 'bg-green-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              {getStepIcon(status)}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${
                  status === 'current' 
                    ? 'text-blue-900' 
                    : status === 'completed'
                    ? 'text-green-800'
                    : 'text-gray-600'
                }`}>
                  {step.title}
                </p>
                {status === 'current' && (
                  <p className="text-xs text-blue-600">In progress...</p>
                )}
                {status === 'completed' && (
                  <p className="text-xs text-green-600">Completed ✓</p>
                )}
              </div>
            </div>
          );
        })}
        
        <div className="pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-600 text-center">
            {stats.completed} of {stats.total} steps completed
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
