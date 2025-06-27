
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ValidationErrors {
  [key: string]: string;
}

interface PracticeDetailsValidationProps {
  errors: ValidationErrors;
}

export const PracticeDetailsValidation: React.FC<PracticeDetailsValidationProps> = ({
  errors
}) => {
  if (Object.keys(errors).length === 0) {
    return null;
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="w-4 h-4" />
      <AlertDescription>
        Please fix the errors above to continue.
      </AlertDescription>
    </Alert>
  );
};
