
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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Chiropractic Practice</h1>
        <p className="text-gray-600 mt-1">Welcome to your practice management dashboard</p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/schedule')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/patient-management')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Patients</p>
                <p className="text-3xl font-bold text-gray-900">1</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/schedule')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Appointments</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/financial-management')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                <p className="text-3xl font-bold text-gray-900">$2,840</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Button 
              className="h-20 flex flex-col items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => navigate('/schedule')}
            >
              <Calendar className="w-6 h-6" />
              <span className="text-sm">New Appointment</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => navigate('/patient-management')}
            >
              <Users className="w-6 h-6" />
              <span className="text-sm">Add Patient</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => navigate('/ehr')}
            >
              <FileText className="w-6 h-6" />
              <span className="text-sm">SOAP Notes</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => navigate('/ehr')}
            >
              <Activity className="w-6 h-6" />
              <span className="text-sm">Treatment Plan</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => navigate('/analytics')}
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-sm">Reports</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => navigate('/agents/remind')}
            >
              <MessageSquare className="w-6 h-6" />
              <span className="text-sm">Reminders</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Today's Schedule
          </CardTitle>
          <CardDescription>0 appointments scheduled for 7/7/2025</CardDescription>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No appointments scheduled for today</p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest patient interactions and system updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">John Doe completed appointment</p>
              <p className="text-xs text-gray-600">10 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Reminder sent to Jane Smith</p>
              <p className="text-xs text-gray-600">25 minutes ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
