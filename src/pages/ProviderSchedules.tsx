import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import { ProviderScheduling } from '@/components/scheduling/ProviderScheduling';

export const ProviderSchedules = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Provider Schedules"
        subtitle="Manage provider schedules, availability, and time off requests"
      />
      
      <ProviderScheduling />
    </div>
  );
};

export default ProviderSchedules;