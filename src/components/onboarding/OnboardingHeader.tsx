
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface OnboardingHeaderProps {
  title: string;
  description: string;
  currentStep?: number;
  totalSteps?: number;
  showProgress?: boolean;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({ 
  title, 
  description,
  currentStep = 0,
  totalSteps = 10,
  showProgress = true
}) => {
  const progressValue = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <CardHeader className="py-6 px-8 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-blue-600">FlowIQ Setup</span>
        </div>
        {showProgress && (
          <span className="text-sm text-gray-600">
            {currentStep + 1} of {totalSteps}
          </span>
        )}
      </div>
      
      <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
        {title}
      </CardTitle>
      <CardDescription className="text-lg text-gray-600 mb-4">
        {description}
      </CardDescription>
      
      {showProgress && (
        <Progress 
          value={progressValue} 
          className="w-full h-2 transition-all duration-500 ease-out"
        />
      )}
    </CardHeader>
  );
};
