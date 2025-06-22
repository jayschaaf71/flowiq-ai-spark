
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  ChevronLeft, 
  ChevronRight, 
  Smartphone,
  Wifi,
  WifiOff,
  Save
} from 'lucide-react';

interface MobileFormOptimizerProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

export const MobileFormOptimizer: React.FC<MobileFormOptimizerProps> = ({
  children,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSubmit,
  isSubmitting = false
}) => {
  const isMobile = useIsMobile();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('form_progress', JSON.stringify({
        currentStep,
        timestamp: new Date().toISOString()
      }));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <div className="bg-white border-b px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-600" />
            <h1 className="font-semibold text-lg">Patient Form</h1>
          </div>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="w-4 h-4 text-green-600" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-600" />
            )}
            <Badge variant="outline">
              Step {currentStep + 1} of {totalSteps}
            </Badge>
          </div>
        </div>
        
        <div className="mt-3">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{Math.round(progressPercentage)}% complete</span>
            {lastSaved && (
              <span className="flex items-center gap-1">
                <Save className="w-3 h-3" />
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 pb-24">
        <Card className="mb-4">
          <CardContent className="p-6">
            {children}
          </CardContent>
        </Card>

        {/* Offline Notice */}
        {!isOnline && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-orange-800">
                <WifiOff className="w-4 h-4" />
                <span className="text-sm">
                  You're offline. Your progress is being saved locally and will sync when you reconnect.
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={currentStep === 0}
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          {currentStep === totalSteps - 1 && onSubmit ? (
            <Button
              onClick={onSubmit}
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={!isOnline || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </Button>
          ) : (
            <Button
              onClick={onNext}
              className="flex-1"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
        
        <div className="text-center mt-2">
          <button
            onClick={saveToLocalStorage}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Manual Save
          </button>
        </div>
      </div>
    </div>
  );
};
