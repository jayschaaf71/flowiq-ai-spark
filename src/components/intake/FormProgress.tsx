
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface FormProgressProps {
  title: string;
  description?: string | null;
  currentStep: number;
  totalSteps: number;
  primaryColor: string;
}

export const FormProgress: React.FC<FormProgressProps> = ({
  title,
  description,
  currentStep,
  totalSteps,
  primaryColor
}) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className={`text-2xl text-${primaryColor}-600`}>
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-base">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Step {currentStep + 1} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </CardContent>
    </Card>
  );
};
