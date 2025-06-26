
import React from 'react';
import { Loader2 } from 'lucide-react';

interface OnboardingLoadingStateProps {
  message?: string;
  showProgress?: boolean;
  progress?: number;
}

export const OnboardingLoadingState: React.FC<OnboardingLoadingStateProps> = ({
  message = "Setting up your practice...",
  showProgress = false,
  progress = 0
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="relative">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <div className="absolute inset-0 w-8 h-8 border-2 border-blue-200 rounded-full animate-pulse" />
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-gray-900">{message}</p>
        {showProgress && (
          <div className="w-64 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
