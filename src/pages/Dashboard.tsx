
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

  const renderSpecialtyDashboard = () => {
    const specialty = userProfile?.specialty;
    
    // Debug logging
    console.log('User Profile:', userProfile);
    console.log('Specialty:', specialty);
    
    switch (specialty) {
      case 'Chiropractic':
        return <ChiropracticDashboard />;
      case 'Dentistry':
        return <DentalDashboard />;
      case 'Dental Sleep Medicine':
        return <DentalSleepDashboard />;
      default:
        // Default to chiropractic if no specialty or unknown specialty
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
