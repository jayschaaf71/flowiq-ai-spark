
import React from 'react';
import { ChiropracticDashboard } from "@/components/chiropractic/ChiropracticDashboard";

export const Dashboard = () => {
  // For chiropractic wrapper, always render ChiropracticDashboard
  return (
    <div className="space-y-6">
      <ChiropracticDashboard />
    </div>
  );
};

export default Dashboard;
