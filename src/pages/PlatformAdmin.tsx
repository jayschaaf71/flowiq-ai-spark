import React from 'react';
import { Layout } from '@/components/Layout';
import { PlatformAdminDashboard } from '@/components/admin/PlatformAdminDashboard';

const PlatformAdmin = () => {
  return (
    <Layout>
      <PlatformAdminDashboard />
    </Layout>
  );
};

export default PlatformAdmin;