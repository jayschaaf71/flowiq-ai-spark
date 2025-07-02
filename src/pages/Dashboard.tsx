
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  Activity, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Brain,
  DollarSign,
  Heart,
  Shield,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ChiropracticDashboard } from "@/components/specialty/dashboards/ChiropracticDashboard";
import { DentalDashboard } from "@/components/specialty/dashboards/DentalDashboard";
import { DentalSleepDashboard } from "@/components/specialty/dashboards/DentalSleepDashboard";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { data: userProfile } = useUserProfile();

  // Add loading and error states
  if (!userProfile && !userProfile?.specialty) {
    console.log('Loading user profile...');
  }

  const renderSpecialtyDashboard = () => {
    const specialty = userProfile?.specialty;
    
    // Enhanced debug logging
    console.log('=== DASHBOARD DEBUG ===');
    console.log('User Profile:', userProfile);
    console.log('Specialty:', specialty);
    console.log('Profile loading state:', { userProfile });
    
    // Handle loading state
    if (!userProfile) {
      console.log('User profile not loaded yet, showing loading...');
      return <div className="text-center p-6">Loading dashboard...</div>;
    }
    
    switch (specialty) {
      case 'Chiropractic':
        console.log('Rendering ChiropracticDashboard');
        return <ChiropracticDashboard />;
      case 'Dentistry':
        console.log('Rendering DentalDashboard');
        return <DentalDashboard />;
      case 'Dental Sleep Medicine':
        console.log('Rendering DentalSleepDashboard');
        return <DentalSleepDashboard />;
      default:
        console.log('Defaulting to ChiropracticDashboard for specialty:', specialty);
        return <ChiropracticDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Specialty-Specific Dashboard */}
      {renderSpecialtyDashboard()}
    </div>
  );
};

export default Dashboard;
