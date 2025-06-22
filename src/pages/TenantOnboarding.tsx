
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { TenantOnboardingFlow } from '@/components/tenant/TenantOnboardingFlow';
import { useToast } from '@/hooks/use-toast';

const TenantOnboarding = () => {
  const { tenantId } = useParams<{ tenantId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleOnboardingComplete = () => {
    toast({
      title: "Setup Complete!",
      description: "Your tenant has been successfully configured.",
    });
    navigate('/');
  };

  if (!tenantId) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600">Invalid Tenant</h1>
          <p className="text-gray-600 mt-2">No tenant ID provided for onboarding.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <TenantOnboardingFlow 
          tenantId={tenantId}
          onComplete={handleOnboardingComplete}
        />
      </div>
    </Layout>
  );
};

export default TenantOnboarding;
