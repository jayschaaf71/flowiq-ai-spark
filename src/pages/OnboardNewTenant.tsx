
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveOnboardingWrapper } from '@/components/onboarding/ResponsiveOnboardingWrapper';
import { useToast } from '@/hooks/use-toast';

const OnboardNewTenant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  console.log('OnboardNewTenant page rendering');

  const handleOnboardingComplete = (data: any) => {
    console.log('Tenant onboarding completed:', data);
    toast({
      title: "Setup Complete!",
      description: "Your practice has been successfully configured.",
    });
    navigate('/dashboard');
  };

  const handleCancel = () => {
    console.log('Onboarding cancelled');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ResponsiveOnboardingWrapper
        onComplete={handleOnboardingComplete}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default OnboardNewTenant;
