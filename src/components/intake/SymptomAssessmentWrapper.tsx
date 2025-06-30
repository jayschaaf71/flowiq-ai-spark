
import React from 'react';
import { useCurrentTenant } from '@/utils/enhancedTenantConfig';
import { ChiropracticSymptomAssessment } from './ChiropracticSymptomAssessment';
import { DentalSymptomAssessment } from './DentalSymptomAssessment';

interface SymptomAssessmentWrapperProps {
  onComplete: (data: any) => void;
  onSkip?: () => void;
}

export const SymptomAssessmentWrapper: React.FC<SymptomAssessmentWrapperProps> = ({
  onComplete,
  onSkip
}) => {
  const { currentTenant } = useCurrentTenant();
  
  const specialty = currentTenant?.specialty?.toLowerCase() || 'chiropractic';
  
  switch (specialty) {
    case 'dental care':
    case 'dental':
    case 'dental-sleep':
      return (
        <DentalSymptomAssessment 
          onComplete={onComplete}
          onSkip={onSkip}
        />
      );
    
    case 'chiropractic care':
    case 'chiropractic':
    default:
      return (
        <ChiropracticSymptomAssessment 
          onComplete={onComplete}
          onSkip={onSkip}
        />
      );
  }
};
