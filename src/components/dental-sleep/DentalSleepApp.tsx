import React from 'react';
import { DentalSleepWrapper } from '@/components/wrappers/DentalSleepWrapper';
import { Routes, Route } from 'react-router-dom';
import { DentalSleepDashboard } from './DentalSleepDashboard';

export const DentalSleepApp: React.FC = () => {
  return (
    <DentalSleepWrapper>
      <Routes>
        <Route path="/dashboard" element={<DentalSleepDashboard />} />
        <Route path="/*" element={<DentalSleepDashboard />} />
      </Routes>
    </DentalSleepWrapper>
  );
};