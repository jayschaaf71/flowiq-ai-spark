
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  ChevronRight,
  SkipForward,
  AlertTriangle
} from 'lucide-react';

interface Step {
  id: string;
  title: string;
  component: string;
  required: boolean;
}

interface MobileStepMenuProps {
  steps: Step[];
  currentStep: number;
  completedSteps: Set<number>;
  skippedSteps: string[];
  onStepSelect: (step: number) => void;
  onClose: () => void;
  isVisible: boolean;
}

export const MobileStepMenu: React.FC<MobileStepMenuProps> = ({
  steps,
  currentStep,
  completedSteps,
  skippedSteps,
  onStepSelect,
  onClose,
  isVisible
}) => {
  if (!isVisible) return null;

  const getStepStatus = (index: number, step: Step) => {
    if (completedSteps.has(index)) return 'completed';
    if (skippedSteps.includes(step.id)) return 'skipped';
    if (index === currentStep) return 'current';
    if (index < currentStep) return 'accessible';
    return 'locked';
  };

  const getStatusIcon = (status: string, required: boolean) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'skipped':
        return <SkipForward className="w-4 h-4 text-orange-600" />;
      case 'current':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return required ? (
          <AlertTriangle className="w-4 h-4 text-gray-400" />
        ) : (
          <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-l-green-500 bg-green-50';
      case 'skipped':
        return 'border-l-orange-500 bg-orange-50';
      case 'current':
        return 'border-l-blue-500 bg-blue-50';
      case 'accessible':
        return 'border-l-gray-300 bg-white hover:bg-gray-50';
      default:
        return 'border-l-gray-200 bg-gray-50';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-30"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div className="fixed inset-y-0 left-0 w-80 bg-white z-40 shadow-xl overflow-y-auto">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Setup Progress</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        </div>
        
        <div className="p-4 space-y-2">
          {steps.map((step, index) => {
            const status = getStepStatus(index, step);
            const canAccess = status === 'accessible' || status === 'current';
            
            return (
              <Card
                key={step.id}
                className={`cursor-pointer transition-all border-l-4 ${getStatusColor(status)}`}
                onClick={() => canAccess && onStepSelect(index)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(status, step.required)}
                      <div>
                        <h3 className={`font-medium ${
                          canAccess ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant={step.required ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {step.required ? 'Required' : 'Optional'}
                          </Badge>
                          {status === 'skipped' && (
                            <Badge variant="outline" className="text-xs text-orange-600">
                              Skipped
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {canAccess && (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="p-4 border-t bg-gray-50">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              {completedSteps.size} of {steps.length} steps completed
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(completedSteps.size / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
