
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ComprehensiveOnboardingFlow } from '@/components/onboarding/ComprehensiveOnboardingFlow';
import { useTenantManagement } from '@/hooks/useTenantManagement';
import { useToast } from '@/hooks/use-toast';
import { SpecialtyType, specialtyConfigs } from '@/utils/specialtyConfig';

const OnboardNewTenant = () => {
  const navigate = useNavigate();
  const { createTenant } = useTenantManagement();
  const { toast } = useToast();

  const handleOnboardingComplete = async (onboardingData: any) => {
    try {
      console.log('Creating tenant with comprehensive onboarding data:', onboardingData);
      
      const specialtyConfig = specialtyConfigs[onboardingData.specialty as SpecialtyType];
      
      // Create the tenant with comprehensive onboarding data
      const tenantData = {
        name: onboardingData.practiceData.practiceName,
        slug: onboardingData.practiceData.practiceName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        brand_name: onboardingData.practiceData.practiceName,
        tagline: onboardingData.practiceData.description || `Professional ${specialtyConfig.brandName} care`,
        specialty: onboardingData.specialty,
        subscription_tier: onboardingData.paymentConfig.subscriptionPlan || 'professional',
        max_forms: getMaxFormsByPlan(onboardingData.paymentConfig.subscriptionPlan),
        max_submissions: getMaxSubmissionsByPlan(onboardingData.paymentConfig.subscriptionPlan),
        max_users: getMaxUsersByPlan(onboardingData.paymentConfig.subscriptionPlan),
        custom_branding_enabled: onboardingData.templateConfig.customizationPreferences.includeBranding,
        api_access_enabled: onboardingData.ehrConfig.enableIntegration,
        white_label_enabled: onboardingData.paymentConfig.subscriptionPlan === 'enterprise',
        primary_color: specialtyConfig.primaryColor,
        secondary_color: specialtyConfig.secondaryColor,
        is_active: true
      };

      await createTenant(tenantData);
      
      // Show comprehensive success message
      const setupFeatures = [];
      if (onboardingData.agentConfig.receptionistAgent) setupFeatures.push('AI Receptionist');
      if (onboardingData.paymentConfig.enablePayments) setupFeatures.push('Payment Processing');
      if (onboardingData.ehrConfig.enableIntegration) setupFeatures.push('EHR Integration');
      if (onboardingData.teamConfig.teamMembers.length > 0) setupFeatures.push(`${onboardingData.teamConfig.teamMembers.length} Team Members`);
      if (onboardingData.templateConfig.enableAutoGeneration) setupFeatures.push('Specialty Templates');
      
      toast({
        title: "🎉 Practice Setup Complete!",
        description: `${onboardingData.practiceData.practiceName} is ready with: ${setupFeatures.join(', ')}.`,
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
      throw error;
    }
  };

  const getMaxFormsByPlan = (plan: string) => {
    switch (plan) {
      case 'starter': return 25;
      case 'professional': return 100;
      case 'enterprise': return -1; // unlimited
      default: return 50;
    }
  };

  const getMaxSubmissionsByPlan = (plan: string) => {
    switch (plan) {
      case 'starter': return 1000;
      case 'professional': return 10000;
      case 'enterprise': return -1; // unlimited
      default: return 5000;
    }
  };

  const getMaxUsersByPlan = (plan: string) => {
    switch (plan) {
      case 'starter': return 5;
      case 'professional': return 25;
      case 'enterprise': return -1; // unlimited
      default: return 10;
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
