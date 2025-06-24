
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ComprehensiveOnboardingFlow } from '@/components/onboarding/ComprehensiveOnboardingFlow';
import { useTenantManagement } from '@/hooks/useTenantManagement';
import { useToast } from '@/hooks/use-toast';
import { SpecialtyType } from '@/utils/specialtyConfig';

const OnboardNewTenant = () => {
  const navigate = useNavigate();
  const { createTenant } = useTenantManagement();
  const { toast } = useToast();

  const handleOnboardingComplete = async (onboardingData: any) => {
    try {
      console.log('Creating tenant with data:', onboardingData);
      
      // Create the tenant with onboarding data
      const tenantData = {
        name: onboardingData.practiceData.practiceName,
        slug: onboardingData.practiceData.practiceName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        brand_name: onboardingData.practiceData.practiceName,
        tagline: `Professional ${onboardingData.specialty} care`,
        specialty: onboardingData.specialty,
        subscription_tier: 'professional',
        max_forms: 50,
        max_submissions: 5000,
        max_users: 25,
        custom_branding_enabled: true,
        api_access_enabled: true,
        white_label_enabled: false,
        primary_color: '#3B82F6', // Will be updated based on specialty
        secondary_color: '#06B6D4',
        is_active: true
      };

      await createTenant(tenantData);
      
      toast({
        title: "Practice Setup Complete!",
        description: `${onboardingData.practiceData.practiceName} has been successfully configured.`,
      });

      // Navigate to the main dashboard
      navigate('/');
      
    } catch (error) {
      console.error('Error creating tenant:', error);
      toast({
        title: "Setup Error",
        description: "There was an issue setting up your practice. Please try again.",
        variant: "destructive"
      });
      throw error; // Re-throw to be handled by the onboarding flow
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <ComprehensiveOnboardingFlow 
      onComplete={handleOnboardingComplete}
      onCancel={handleCancel}
    />
  );
};

export default OnboardNewTenant;
