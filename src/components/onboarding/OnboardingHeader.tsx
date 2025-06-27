
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skip } from 'lucide-react';

interface OnboardingHeaderProps {
  title: string;
  description: string;
  currentStep: number;
  totalSteps: number;
  showProgress?: boolean;
  completionPercentage?: number;
  onShowSkipOptions?: () => void;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  title,
  description,
  currentStep,
  totalSteps,
  showProgress = true,
  completionPercentage,
  onShowSkipOptions
}) => {
  const progressValue = completionPercentage || ((currentStep + 1) / totalSteps) * 100;

  return (
    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-blue-600">
            Step {currentStep + 1} of {totalSteps}
          </span>
        </div>
        
        {onShowSkipOptions && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onShowSkipOptions}
            className="text-gray-500 hover:text-gray-700"
          >
            <Skip className="w-4 h-4 mr-2" />
            Skip
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {title}
          </CardTitle>
          <CardDescription className="mt-2 text-gray-600 leading-relaxed">
            {description}
          </CardDescription>
        </div>

        {showProgress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Overall Progress</span>
              <span className="font-medium">{Math.round(progressValue)}% complete</span>
            </div>
            <Progress 
              value={progressValue} 
              className="h-2 bg-gray-200"
            />
          </div>
        )}
      </div>
    </CardHeader>
  );
};
