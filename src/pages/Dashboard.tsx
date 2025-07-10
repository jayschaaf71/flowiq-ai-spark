
import React from 'react';
import { useUserProfile } from "@/hooks/useUserProfile";
import { ChiropracticDashboard } from "@/components/chiropractic/ChiropracticDashboard";
import { DentalDashboard } from "@/components/specialty/dashboards/DentalDashboard";
import DentalSleepIQ from "./agents/DentalSleepIQ";

export const Dashboard = () => {
  const { data: userProfile } = useUserProfile();

  const renderSpecialtyDashboard = () => {
    // Use the same localStorage key as TenantWrapper for consistency
    const currentSpecialty = localStorage.getItem('currentSpecialty') || 'chiropractic';
    
    console.log('=== DASHBOARD DEBUG ===');
    console.log('Current specialty from localStorage:', currentSpecialty);
    console.log('User Profile:', userProfile);
    
    // Route to correct specialty dashboard based on detected specialty
    switch (currentSpecialty) {
      case 'dental-sleep':
      case 'dental-sleep-medicine':
        console.log('Rendering DentalSleepIQ');
        return <DentalSleepIQ />;
      case 'dental':
      case 'dental-care':
      case 'dentistry':
        console.log('Rendering DentalDashboard');
        return <DentalDashboard />;
      case 'chiropractic':
      case 'chiropractic-care':
      default:
        console.log('Rendering ChiropracticDashboard');
        return <ChiropracticDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      {renderSpecialtyDashboard()}
    </div>
  );
};

export default Dashboard;
