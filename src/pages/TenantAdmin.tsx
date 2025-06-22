
import React from 'react';
import { Layout } from '@/components/Layout';
import { TenantAdminDashboard } from '@/components/tenant/TenantAdminDashboard';

const TenantAdmin = () => {
  return (
    <Layout>
      <TenantAdminDashboard />
    </Layout>
  );
};

export default TenantAdmin;
