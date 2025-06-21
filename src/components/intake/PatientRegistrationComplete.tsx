
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { IntakeForm } from '@/hooks/useIntakeForms';

interface PatientRegistrationCompleteProps {
  completedForms: string[];
  forms: IntakeForm[];
  onStartNew: () => void;
}

export const PatientRegistrationComplete: React.FC<PatientRegistrationCompleteProps> = ({
  completedForms,
  forms,
  onStartNew
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
          <h2 className="text-2xl font-semibold mb-2">Intake Complete!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for completing your intake forms. Your information has been submitted successfully.
          </p>
          <div className="space-y-2 mb-6">
            <p className="text-sm font-medium">Completed Forms:</p>
            {completedForms.map(formId => {
              const form = forms.find(f => f.id === formId);
              return form ? (
                <div key={formId} className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">{form.title}</span>
                </div>
              ) : null;
            })}
          </div>
          <Button
            onClick={onStartNew}
            variant="outline"
          >
            Start New Intake
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
