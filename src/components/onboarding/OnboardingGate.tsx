import React from 'react';
import { usePatientOnboarding } from '@/hooks/usePatientOnboarding';
import { PatientOnboardingFlow } from './PatientOnboardingFlow';
import { Loader2 } from 'lucide-react';

interface OnboardingGateProps {
  children: React.ReactNode;
}

export const OnboardingGate: React.FC<OnboardingGateProps> = ({ children }) => {
  const { onboarding, loading } = usePatientOnboarding();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-700">Loading...</span>
        </div>
      </div>
    );
  }

  // If onboarding is not completed, show onboarding flow
  if (!onboarding?.is_completed) {
    return (
      <PatientOnboardingFlow 
        onComplete={() => window.location.reload()} 
        onSkip={() => window.location.reload()}
      />
    );
  }

  // If onboarding is completed, show the main content
  return <>{children}</>;
};