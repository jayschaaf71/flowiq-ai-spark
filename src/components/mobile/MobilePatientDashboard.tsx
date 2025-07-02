import React from 'react';
import { EnhancedMobileInterface } from './EnhancedMobileInterface';
import { PatientMobileExperience } from './PatientMobileExperience';
import { useIsMobile } from '@/hooks/use-mobile';

export const MobilePatientDashboard: React.FC = () => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    // Fallback to regular patient dashboard for desktop
    return (
      <div className="container mx-auto p-6">
        <PatientMobileExperience />
      </div>
    );
  }

  return (
    <EnhancedMobileInterface showPatientFeatures={true}>
      <PatientMobileExperience />
    </EnhancedMobileInterface>
  );
};