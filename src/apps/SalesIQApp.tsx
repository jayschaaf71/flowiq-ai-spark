import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SalesIQDashboard } from '@/components/sales/SalesIQDashboard';
import { Layout } from '@/components/Layout';

const SalesIQApp = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<SalesIQDashboard />} />
        <Route path="/*" element={<SalesIQDashboard />} />
      </Routes>
    </Layout>
  );
};

export default SalesIQApp;