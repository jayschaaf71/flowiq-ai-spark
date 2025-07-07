
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
import { ChiropracticDashboard } from "@/components/chiropractic/ChiropracticDashboard";
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
    // Use localStorage specialty detection instead of user profile
    const currentSpecialty = localStorage.getItem('currentSpecialty') || 'chiropractic';
    
    console.log('=== DASHBOARD DEBUG ===');
    console.log('Current specialty from localStorage:', currentSpecialty);
    console.log('User Profile:', userProfile);
    
    // Route to correct specialty dashboard based on detected specialty
    switch (currentSpecialty) {
      case 'dental-sleep':
      case 'dental-sleep-medicine':
        console.log('Rendering DentalSleepDashboard');
        return <DentalSleepDashboard />;
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
  };
  };

  return (
    <div className="space-y-6">
      {/* Specialty-Specific Dashboard */}
      {renderSpecialtyDashboard()}
    </div>
  );
};

export default Dashboard;
