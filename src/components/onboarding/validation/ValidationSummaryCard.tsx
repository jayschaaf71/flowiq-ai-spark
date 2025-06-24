
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ValidationSummaryCardProps {
  hasValidationResults: boolean;
  allValidationsSuccessful: boolean;
}

export const ValidationSummaryCard: React.FC<ValidationSummaryCardProps> = ({
  hasValidationResults,
  allValidationsSuccessful
}) => {
  if (!hasValidationResults) return null;

  return (
    <Card className={`mt-4 ${allValidationsSuccessful ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {allValidationsSuccessful ? (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-600" />
          )}
          <div>
            <p className={`text-sm font-medium ${allValidationsSuccessful ? 'text-green-800' : 'text-yellow-800'}`}>
              {allValidationsSuccessful 
                ? 'All integrations validated successfully!' 
                : 'Some integrations need attention before going live.'
              }
            </p>
            <p className={`text-xs ${allValidationsSuccessful ? 'text-green-700' : 'text-yellow-700'}`}>
              {allValidationsSuccessful 
                ? 'Your practice is ready to start using these integrations.' 
                : 'Review the failed validations and fix any issues before proceeding.'
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
