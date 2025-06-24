
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2 } from 'lucide-react';

interface ValidationActionButtonsProps {
  onSkip: () => void;
  onValidate: () => void;
  isValidating: boolean;
  hasValidationResults: boolean;
  enabledIntegrationsCount: number;
}

export const ValidationActionButtons: React.FC<ValidationActionButtonsProps> = ({
  onSkip,
  onValidate,
  isValidating,
  hasValidationResults,
  enabledIntegrationsCount
}) => {
  return (
    <div className="flex justify-between items-center pt-6">
      <Button variant="outline" onClick={onSkip}>
        Skip Validation
      </Button>
      
      <div className="flex gap-3">
        {hasValidationResults && (
          <Button 
            variant="outline" 
            onClick={onValidate}
            disabled={isValidating}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Re-validate
          </Button>
        )}
        
        <Button 
          onClick={onValidate}
          disabled={isValidating || enabledIntegrationsCount === 0}
        >
          {isValidating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Validating...
            </>
          ) : hasValidationResults ? (
            'Continue'
          ) : (
            'Start Validation'
          )}
        </Button>
      </div>
    </div>
  );
};
