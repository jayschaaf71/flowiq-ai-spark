
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Clock } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description?: string;
  estimatedTime?: string;
  isCompleted?: boolean;
  isCurrent?: boolean;
}

interface OnboardingProgressTrackerProps {
  steps: OnboardingStep[];
  currentStepIndex: number;
  completedSteps: Set<number>;
  showTimeEstimates?: boolean;
  variant?: 'horizontal' | 'vertical' | 'mobile';
}

export const OnboardingProgressTracker: React.FC<OnboardingProgressTrackerProps> = ({
  steps,
  currentStepIndex,
  completedSteps,
  showTimeEstimates = true,
  variant = 'horizontal'
}) => {
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;
  const currentStep = steps[currentStepIndex];
  const totalCompletedSteps = completedSteps.size;

  if (variant === 'mobile') {
    return (
      <div className="space-y-4">
        {/* Mobile header */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
          <Badge variant="outline" className="text-xs">
            {Math.round(progressPercentage)}% Complete
          </Badge>
        </div>
        
        {/* Progress bar */}
        <Progress value={progressPercentage} className="h-2" />
        
        {/* Current step info */}
        <div className="text-center">
          <h3 className="font-semibold text-lg text-gray-900">
            {currentStep?.title}
          </h3>
          {currentStep?.description && (
            <p className="text-sm text-gray-600 mt-1">
              {currentStep.description}
            </p>
          )}
          {showTimeEstimates && currentStep?.estimatedTime && (
            <div className="flex items-center justify-center gap-1 mt-2">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                Est. {currentStep.estimatedTime}
              </span>
            </div>
          )}
        </div>
        
        {/* Step dots */}
        <div className="flex justify-center space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentStepIndex
                  ? 'bg-blue-600 scale-125'
                  : completedSteps.has(index)
                  ? 'bg-green-600'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'vertical') {
    return (
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(index);
          const isCurrent = index === currentStepIndex;
          
          return (
            <div key={step.id} className="flex items-start space-x-4">
              <div className={`
                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                ${isCurrent ? 'border-blue-500 bg-blue-50' : 
                  isCompleted ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white'}
              `}>
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Circle className={`w-4 h-4 ${isCurrent ? 'text-blue-600' : 'text-gray-400'}`} />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium ${isCurrent ? 'text-blue-900' : isCompleted ? 'text-green-900' : 'text-gray-700'}`}>
                  {step.title}
                </h4>
                {step.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {step.description}
                  </p>
                )}
                {showTimeEstimates && step.estimatedTime && (
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {step.estimatedTime}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div className="space-y-6">
      {/* Progress overview */}
      <div className="text-center">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progress: {totalCompletedSteps} of {steps.length} completed
          </span>
          <Badge variant="outline">
            {Math.round(progressPercentage)}% Complete
          </Badge>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
      
      {/* Step indicators */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.has(index);
            const isCurrent = index === currentStepIndex;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className="text-center">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center border-2 mb-2 transition-all
                    ${isCurrent ? 'border-blue-500 bg-blue-50' : 
                      isCompleted ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white'}
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <span className={`text-sm font-medium ${
                        isCurrent ? 'text-blue-600' : 'text-gray-400'
                      }`}>
                        {index + 1}
                      </span>
                    )}
                  </div>
                  
                  <div className="max-w-24">
                    <h4 className={`text-sm font-medium ${
                      isCurrent ? 'text-blue-900' : isCompleted ? 'text-green-900' : 'text-gray-700'
                    }`}>
                      {step.title}
                    </h4>
                    {showTimeEstimates && step.estimatedTime && (
                      <p className="text-xs text-gray-500 mt-1">
                        {step.estimatedTime}
                      </p>
                    )}
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Current step details */}
      {currentStep && (
        <div className="text-center bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-1">
            {currentStep.title}
          </h3>
          {currentStep.description && (
            <p className="text-gray-600">
              {currentStep.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
