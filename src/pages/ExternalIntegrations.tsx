import React from 'react';
import { Layout } from '@/components/Layout';
import { IntegrationsDashboard } from '@/components/integrations/IntegrationsDashboard';

export const ExternalIntegrationsPage = () => {
  return (
    <Layout>
      <IntegrationsDashboard />
    </Layout>
  );
};

export default ExternalIntegrationsPage;