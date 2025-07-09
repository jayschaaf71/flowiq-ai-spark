import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { ProviderNotificationPreferences } from '@/components/provider/ProviderNotificationPreferences';

export const ProviderNotificationSettings: React.FC = () => {
  const navigate = useNavigate();
  
  // In a real app, you'd get this from auth context
  const providerId = 'current-provider-id'; // This should come from auth context

  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title="Notification Settings"
        subtitle="Configure your notification preferences"
      >
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </PageHeader>
      
      <div className="container mx-auto px-6 py-8">
        <ProviderNotificationPreferences providerId={providerId} />
      </div>
    </div>
  );
};