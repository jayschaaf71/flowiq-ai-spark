
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  ChevronLeft, 
  ChevronRight, 
  Menu,
  X,
  CheckCircle,
  Clock,
  Smartphone,
  Wifi,
  WifiOff
} from 'lucide-react';

interface MobileOnboardingFlowProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  stepDescription: string;
  children: React.ReactNode;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
  canProceed: boolean;
  isLoading: boolean;
  completionPercentage: number;
  completedSteps: Set<number>;
  showMenu?: boolean;
  onMenuToggle?: () => void;
}

export const MobileOnboardingFlow: React.FC<MobileOnboardingFlowProps> = ({
  currentStep,
  totalSteps,
  stepTitle,
  stepDescription,
  children,
  onNext,
  onPrevious,
  onComplete,
  canProceed,
  isLoading,
  completionPercentage,
  completedSteps,
  showMenu = false,
  onMenuToggle
}) => {
  const isMobile = useIsMobile();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;
  const isStepCompleted = completedSteps.has(currentStep);

  // Online/offline detection
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isMobile) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            {children}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <div className="bg-white border-b px-4 py-3 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuToggle}
              className="p-2 -ml-2 rounded-lg hover:bg-gray-100"
            >
              {showMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-600" />
              <h1 className="font-semibold text-lg">FlowIQ Setup</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="w-4 h-4 text-green-600" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-600" />
            )}
            <Badge variant="outline" className="text-xs">
              {currentStep + 1}/{totalSteps}
            </Badge>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <span className="flex items-center gap-1">
              {isStepCompleted ? (
                <CheckCircle className="w-3 h-3 text-green-600" />
              ) : (
                <Clock className="w-3 h-3 text-gray-400" />
              )}
              {stepTitle}
            </span>
            <span className="font-medium">{Math.round(completionPercentage)}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
      </div>

      {/* Step Progress Dots */}
      <div className="flex justify-center py-4 bg-white border-b">
        <div className="flex space-x-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentStep
                  ? 'bg-blue-600'
                  : completedSteps.has(i)
                  ? 'bg-green-600'
                  : i < currentStep
                  ? 'bg-blue-200'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 pb-24">
          {/* Step Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{stepTitle}</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{stepDescription}</p>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {children}
          </div>

          {/* Offline Notice */}
          {!isOnline && (
            <Alert className="mt-6 border-orange-200 bg-orange-50">
              <WifiOff className="w-4 h-4" />
              <AlertDescription className="text-orange-800">
                You're offline. Your progress is being saved locally and will sync when you reconnect.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isFirstStep || isLoading}
            className="flex-1 h-12"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <Button
            onClick={isLastStep ? onComplete : onNext}
            disabled={!canProceed || isLoading}
            className={`flex-1 h-12 ${
              isLastStep 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              'Processing...'
            ) : isLastStep ? (
              'Complete Setup'
            ) : (
              <>
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
