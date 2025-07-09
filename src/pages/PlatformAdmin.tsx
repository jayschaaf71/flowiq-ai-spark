import React from 'react';
import { Layout } from '@/components/Layout';
import { PlatformAdminDashboard } from '@/components/admin/PlatformAdminDashboard';
import { PlatformAdminAccessWrapper } from '@/components/admin/PlatformAdminAccessWrapper';

const PlatformAdmin = () => {
  return (
    <Layout>
      <PlatformAdminAccessWrapper>
        <PlatformAdminDashboard />
      </PlatformAdminAccessWrapper>
    </Layout>
  );
};

export default PlatformAdmin;