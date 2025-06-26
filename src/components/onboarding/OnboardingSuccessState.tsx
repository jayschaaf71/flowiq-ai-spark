
import React from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';

interface OnboardingSuccessStateProps {
  title: string;
  message: string;
  showAnimation?: boolean;
}

export const OnboardingSuccessState: React.FC<OnboardingSuccessStateProps> = ({
  title,
  message,
  showAnimation = true
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <div className={`relative ${showAnimation ? 'animate-scale-in' : ''}`}>
        <CheckCircle className="w-16 h-16 text-green-500" />
        {showAnimation && (
          <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
        )}
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 max-w-md">{message}</p>
      </div>
    </div>
  );
};
