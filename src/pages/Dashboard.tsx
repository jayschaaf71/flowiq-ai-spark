
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
import { EnhancedDashboardHeader } from "@/components/dashboard/EnhancedDashboardHeader";
import { RealTimeActivityFeed } from "@/components/dashboard/RealTimeActivityFeed";
import { SmartInsightsWidget } from "@/components/dashboard/SmartInsightsWidget";
import { SpecialtySwitcher, SpecialtyOption } from "@/components/specialty/SpecialtySwitcher";
import { useSpecialty } from "@/contexts/SpecialtyContext";
import { ChiropracticDashboard } from "@/components/specialty/dashboards/ChiropracticDashboard";
import { DentalDashboard } from "@/components/specialty/dashboards/DentalDashboard";
import { DentalSleepDashboard } from "@/components/specialty/dashboards/DentalSleepDashboard";
import { AppointmentDashboard } from "@/components/specialty/dashboards/AppointmentDashboard";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { currentSpecialty, setCurrentSpecialty } = useSpecialty();

  const practiceAreas = [
    {
      title: "Financial Management",
      description: "Revenue cycle, claims, and payment processing",
      icon: DollarSign,
      color: "text-green-600",
      path: "/financial",
      metrics: ["$47K collected today", "91% auto-post rate", "18.2 days A/R"]
    },
    {
      title: "Patient Experience",
      description: "Satisfaction tracking and patient portal",
      icon: Heart,
      color: "text-pink-600",
      path: "/patient-experience",
      metrics: ["4.8/5 satisfaction", "89% portal usage", "2.3 min response time"]
    },
    {
      title: "Compliance & Security",
      description: "HIPAA compliance and security monitoring",
      icon: Shield,
      color: "text-blue-600",
      path: "/compliance",
      metrics: ["98% HIPAA score", "94% security audit", "100% data backup"]
    }
  ];

  const handleViewAllActivity = () => {
    navigate('/manager');
  };

  const handleSpecialtyChange = (specialty: SpecialtyOption) => {
    console.log('Switching specialty to:', specialty.specialty);
    setCurrentSpecialty(specialty.specialty);
  };

  const renderSpecialtyDashboard = () => {
    console.log('Rendering dashboard for specialty:', currentSpecialty);
    switch (currentSpecialty) {
      case 'chiropractic-care':
        return <ChiropracticDashboard />;
      case 'dental-care':
        return <DentalDashboard />;
      case 'dental-sleep-medicine':
        return <DentalSleepDashboard />;
      case 'appointment-scheduling':
        return <AppointmentDashboard />;
      default:
        console.log('Defaulting to ChiropracticDashboard for:', currentSpecialty);
        return <ChiropracticDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Specialty Switcher */}
      <SpecialtySwitcher 
        currentSpecialty={currentSpecialty}
        onSpecialtyChange={handleSpecialtyChange}
      />

      {/* Specialty-Specific Dashboard */}
      {renderSpecialtyDashboard()}

    </div>
  );
};

export default Dashboard;
