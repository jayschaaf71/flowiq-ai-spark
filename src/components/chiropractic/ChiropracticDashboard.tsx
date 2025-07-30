import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { 
  Calendar,
  Users,
  Activity,
  TrendingUp,
  FileText,
  Bell,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { PatientManager } from "@/components/core/PatientManager";
import { AppointmentManager } from "@/components/core/AppointmentManager";
import { useAppointments } from "@/hooks/useAppointments";
import { usePatients } from "@/hooks/usePatients";
import { DashboardSkeleton } from "@/components/LoadingStates";
import { showErrorToast } from "@/components/feedback/Toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const ChiropracticDashboard = () => {
  console.log('🏥 ChiropracticDashboard: Rendering ChiropracticDashboard component');
  const navigate = useNavigate();
  const { appointments, loading: appointmentsLoading, error: appointmentsError } = useAppointments();
  const { data: patients, isLoading: patientsLoading, error: patientsError } = usePatients();
  
  // Debug component to see if this component is rendering
  const debugComponent = (
    <div style={{ padding: '20px', backgroundColor: 'green', color: 'white', margin: '20px' }}>
      <h1>ChiropracticDashboard Debug</h1>
      <p>Appointments Loading: {appointmentsLoading ? 'Yes' : 'No'}</p>
      <p>Patients Loading: {patientsLoading ? 'Yes' : 'No'}</p>
      <p>Appointments Error: {appointmentsError ? 'Yes' : 'No'}</p>
      <p>Patients Error: {patientsError ? 'Yes' : 'No'}</p>
      <p>Appointments Count: {appointments?.length || 0}</p>
      <p>Patients Count: {patients?.length || 0}</p>
    </div>
  );
  
  console.log('🏥 ChiropracticDashboard: Data state', {
    appointmentsLoading,
    patientsLoading,
    appointmentsError,
    patientsError,
    appointmentsCount: appointments?.length,
    patientsCount: patients?.length
  });

  // Handle errors with useEffect to prevent infinite re-renders
  useEffect(() => {
    if (appointmentsError || patientsError) {
      showErrorToast("Failed to load dashboard data", "Please refresh the page or contact support");
    }
  }, [appointmentsError, patientsError]);

  // Show loading state
  if (appointmentsLoading || patientsLoading) {
    return <DashboardSkeleton />;
  }

  // Quick stats calculations
  const todayDate = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments?.filter(apt => apt.date === todayDate) || [];
  const pendingAppointments = appointments?.filter(apt => apt.status === 'pending') || [];
  const activePatients = patients?.filter(p => p.is_active) || [];

  const statsCards = [
    {
      title: "Today's Appointments",
      value: todayAppointments.length,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      onClick: () => navigate('/chiropractic/schedule')
    },
    {
      title: "Active Patients",
      value: activePatients.length,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      onClick: () => navigate('/chiropractic/patient-management')
    },
    {
      title: "Pending Appointments",
      value: pendingAppointments.length,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      onClick: () => navigate('/chiropractic/schedule')
    },
    {
      title: "Today's Revenue",
      value: "$2,840",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      onClick: () => navigate('/chiropractic/financial')
    }
  ];

  return (
    <div className="space-y-6">
      {debugComponent}
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Chiropractic Practice</h1>
        <p className="text-gray-600">Welcome to your practice management dashboard</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={stat.onClick}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Button 
              className="h-20 flex-col gap-2"
              onClick={() => navigate('/chiropractic/schedule')}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-xs">New Appointment</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => navigate('/chiropractic/patient-management')}
            >
              <Users className="w-5 h-5" />
              <span className="text-xs">Add Patient</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => navigate('/chiropractic/ehr')}
            >
              <FileText className="w-5 h-5" />
              <span className="text-xs">SOAP Notes</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => navigate('/chiropractic/ehr')}
            >
              <Activity className="w-5 h-5" />
              <span className="text-xs">Treatment Plan</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => navigate('/chiropractic/analytics')}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs">Reports</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => navigate('/chiropractic/agents/remind')}
            >
              <Bell className="w-5 h-5" />
              <span className="text-xs">Reminders</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Today's Schedule
          </CardTitle>
          <CardDescription>
            {todayAppointments.length} appointments scheduled for {new Date().toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {appointmentsLoading ? (
            <div className="text-center py-8">Loading today's appointments...</div>
          ) : todayAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No appointments scheduled for today
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-gray-600">
                      {appointment.time}
                    </div>
                    <div>
                      <p className="font-medium">{appointment.patient_name || appointment.title}</p>
                      <p className="text-sm text-gray-600">{appointment.appointment_type}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                    className={
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }
                  >
                    {appointment.status}
                  </Badge>
                </div>
              ))}
              {todayAppointments.length > 5 && (
                <div className="text-center pt-2">
                  <Button 
                    variant="link" 
                    size="sm"
                    onClick={() => navigate('/chiropractic/schedule')}
                  >
                    View all {todayAppointments.length} appointments
                  </Button>
                </div>
              )}
            </div>
          )}
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
        <CardContent>
          <div className="space-y-3">
            {[
              { icon: CheckCircle, text: "John Doe completed appointment", time: "10 minutes ago", type: "success" },
              { icon: Bell, text: "Reminder sent to Jane Smith", time: "25 minutes ago", type: "info" },
              { icon: Users, text: "New patient Michael Johnson registered", time: "1 hour ago", type: "success" },
              { icon: AlertTriangle, text: "Insurance verification needed for Sarah Wilson", time: "2 hours ago", type: "warning" },
              { icon: FileText, text: "SOAP note completed for Robert Brown", time: "3 hours ago", type: "info" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-2">
                <div className={`p-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-100' :
                  activity.type === 'warning' ? 'bg-yellow-100' :
                  'bg-blue-100'
                }`}>
                  <activity.icon className={`w-4 h-4 ${
                    activity.type === 'success' ? 'text-green-600' :
                    activity.type === 'warning' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.text}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Management Tabs */}
      <Tabs defaultValue="appointments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="appointments">Appointment Management</TabsTrigger>
          <TabsTrigger value="patients">Patient Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appointments">
          <ErrorBoundary>
            <AppointmentManager />
          </ErrorBoundary>
        </TabsContent>
        
        <TabsContent value="patients">
          <ErrorBoundary>
            <PatientManager />
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  );
};