
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IntakeForm } from '@/hooks/useIntakeForms';
import { PatientFormRenderer } from './PatientFormRenderer';

interface PatientRegistrationProcessProps {
  currentForm: IntakeForm;
  currentFormIndex: number;
  formSequence: string[];
  onSubmissionComplete: (submission: any) => void;
  onSkipForm: () => void;
  onExit: () => void;
}

export const PatientRegistrationProcess: React.FC<PatientRegistrationProcessProps> = ({
  currentForm,
  currentFormIndex,
  formSequence,
  onSubmissionComplete,
  onSkipForm,
  onExit
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Patient Intake Process</h2>
              <p className="text-sm text-gray-600">
                Step {currentFormIndex + 1} of {formSequence.length}: {currentForm.title}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-xs text-gray-500">
                    {Math.round(((currentFormIndex + 1) / formSequence.length) * 100)}% Complete
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {currentFormIndex > 0 && (
                <Button
                  variant="outline"
                  onClick={onSkipForm}
                  size="sm"
                >
                  Skip This Form
                </Button>
              )}
              <Button
                variant="outline"
                onClick={onExit}
              >
                Exit Process
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <PatientFormRenderer
        form={currentForm}
        onSubmissionComplete={onSubmissionComplete}
      />
    </div>
  );
};
