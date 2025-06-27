
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skip, Clock, AlertCircle } from 'lucide-react';

interface SkipOption {
  id: string;
  title: string;
  description: string;
  recommended?: boolean;
  setupLater?: boolean;
}

interface OnboardingSkipHandlerProps {
  step: string;
  onSkip: (option: SkipOption) => void;
  onContinue: () => void;
  className?: string;
}

export const OnboardingSkipHandler: React.FC<OnboardingSkipHandlerProps> = ({
  step,
  onSkip,
  onContinue,
  className = ''
}) => {
  const getSkipOptions = (step: string): SkipOption[] => {
    const optionsByStep: Record<string, SkipOption[]> = {
      team: [
        {
          id: 'skip-for-now',
          title: 'Skip for now',
          description: 'Set up team members later from the settings page',
          setupLater: true
        },
        {
          id: 'solo-practice',
          title: 'Solo practice',
          description: "I'm running a solo practice and don't need team features",
          recommended: true
        }
      ],
      payment: [
        {
          id: 'setup-later',
          title: 'Set up later',
          description: 'Configure payment processing after launch',
          setupLater: true
        },
        {
          id: 'no-online-payments',
          title: 'No online payments',
          description: 'I handle payments offline or use another system',
          recommended: true
        }
      ],
      ehr: [
        {
          id: 'manual-setup',
          title: 'Manual setup later',
          description: 'I need help configuring my EHR integration',
          setupLater: true
        },
        {
          id: 'no-ehr',
          title: 'No EHR integration',
          description: 'I don\'t use an EHR or will integrate later'
        }
      ]
    };

    return optionsByStep[step] || [
      {
        id: 'skip-default',
        title: 'Skip this step',
        description: 'Continue without configuring this feature',
        setupLater: true
      }
    ];
  };

  const skipOptions = getSkipOptions(step);

  if (skipOptions.length === 0) {
    return null;
  }

  return (
    <Card className={`border-dashed border-gray-300 ${className}`}>
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3">
          <Skip className="w-8 h-8 text-gray-400" />
        </div>
        <CardTitle className="text-lg text-gray-700">Want to skip this step?</CardTitle>
        <CardDescription>
          Choose an option that best describes your situation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {skipOptions.map((option) => (
          <div
            key={option.id}
            className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50 ${
              option.recommended ? 'border-green-200 bg-green-50' : 'border-gray-200'
            }`}
            onClick={() => onSkip(option)}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {option.setupLater ? (
                  <Clock className="w-4 h-4 text-blue-500" />
                ) : option.recommended ? (
                  <AlertCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Skip className="w-4 h-4 text-gray-500" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  {option.title}
                  {option.recommended && (
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Recommended
                    </span>
                  )}
                </h4>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t border-gray-100 text-center">
          <Button variant="outline" onClick={onContinue} className="w-full">
            Actually, let me configure this step
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
