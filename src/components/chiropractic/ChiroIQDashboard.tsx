
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Activity, 
  Users, 
  Calendar, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Phone,
  MessageSquare,
  Target
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { TodaysAppointments } from "./widgets/TodaysAppointments";
import { CheckInQueue } from "./widgets/CheckInQueue";
import { OutstandingTasks } from "./widgets/OutstandingTasks";
import { DailyRevenue } from "./widgets/DailyRevenue";
import { AISummary } from "./widgets/AISummary";
import { PatientOutcomes } from "./widgets/PatientOutcomes";
import { PendingSOAPs } from "./widgets/PendingSOAPs";
import { NoShowSummary } from "./widgets/NoShowSummary";
import { VoicemailQueue } from "./widgets/VoicemailQueue";
import { ComplianceAlerts } from "./widgets/ComplianceAlerts";
import { ClaimsOverview } from "./widgets/ClaimsOverview";

export const ChiroIQDashboard = () => {
  const { profile } = useAuth();
  const userRole = profile?.role || 'staff';
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getUserName = () => {
    return profile?.first_name || 'Doctor';
  };

  const getRoleSpecificWidgets = () => {
    switch (userRole) {
      case 'provider':
        return (
          <>
            <PatientOutcomes />
            <PendingSOAPs />
          </>
        );
      case 'front_desk':
        return (
          <>
            <NoShowSummary />
            <VoicemailQueue />
          </>
        );
      case 'office_manager':
        return (
          <>
            <ComplianceAlerts />
          </>
        );
      case 'biller':
        return (
          <>
            <ClaimsOverview />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-800 flex items-center gap-3">
              <Activity className="w-8 h-8" />
              ChiroIQ Dashboard
            </h1>
            <p className="text-green-600 mt-1">
              {getGreeting()}, {getUserName()}! Here's your practice overview for today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Activity className="w-3 h-3 mr-1" />
              {userRole.replace('_', ' ').toUpperCase()}
            </Badge>
            <Button 
              variant="outline" 
              className="border-green-200 text-green-700 hover:bg-green-50"
              onClick={() => navigate('/analytics')}
            >
              <Target className="w-4 h-4 mr-2" />
              Set Goals
            </Button>
          </div>
        </div>
      </div>

      {/* AI Summary - Always visible */}
      <div className="mb-6">
        <AISummary />
      </div>

      {/* Core Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        <TodaysAppointments />
        <CheckInQueue />
        <OutstandingTasks />
        <DailyRevenue />
        
        {/* Role-specific widgets */}
        {getRoleSpecificWidgets()}
      </div>

      {/* Quick Actions */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common tasks for your role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2 border-green-200 hover:bg-green-50"
              onClick={() => navigate('/schedule')}
            >
              <Calendar className="w-6 h-6 text-green-600" />
              <span className="text-sm">Schedule</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2 border-green-200 hover:bg-green-50"
              onClick={() => navigate('/ehr')}
            >
              <FileText className="w-6 h-6 text-green-600" />
              <span className="text-sm">SOAP Notes</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2 border-green-200 hover:bg-green-50"
              onClick={() => navigate('/patient-management')}
            >
              <Users className="w-6 h-6 text-green-600" />
              <span className="text-sm">Patients</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2 border-green-200 hover:bg-green-50"
              onClick={() => navigate('/financial-management')}
            >
              <DollarSign className="w-6 h-6 text-green-600" />
              <span className="text-sm">Billing</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
