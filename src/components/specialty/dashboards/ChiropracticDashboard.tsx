
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSpecialty } from '@/contexts/SpecialtyContext';
import { useNavigate } from 'react-router-dom';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { 
  Activity, 
  Users, 
  Calendar, 
  TrendingUp,
  Stethoscope,
  Clock,
  DollarSign
} from "lucide-react";

export const ChiropracticDashboard = () => {
  const navigate = useNavigate();
  const { data: metrics, isLoading, error } = useDashboardMetrics();
  const { config } = useSpecialty();
  
  // Fallback config for ChiropracticIQ
  const dashboardConfig = {
    name: config?.brand_name || 'Chiropractic IQ',
    tagline: config?.tagline || 'Optimizing spinal health and mobility'
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-green-200 animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-red-600">Error loading dashboard data</p>
      </div>
    );
  }

  const todaysMetrics = {
    appointments: metrics?.appointmentsToday || 0,
    newPatients: metrics?.newPatientsThisWeek || 0,
    revenue: metrics?.todaysRevenue || 0,
    avgPainReduction: 68 // This would come from treatment outcomes data
  };

  const recentPatients = metrics?.recentPatients?.slice(0, 3).map(patient => ({
    name: `${patient.first_name} ${patient.last_name}`,
    condition: 'Treatment in progress', // Would come from treatment plans
    lastVisit: new Date(patient.created_at).toLocaleDateString(),
    progress: 'Good'
  })) || [];

  return (
    <div className="space-y-6">

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-green-200 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/schedule')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{todaysMetrics.appointments}</div>
            <p className="text-xs text-green-600">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/patient-management?filter=new')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Patients</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{todaysMetrics.newPatients}</div>
            <p className="text-xs text-green-600">This week</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/financial')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">${todaysMetrics.revenue}</div>
            <p className="text-xs text-green-600">+12% from avg</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/analytics?metric=pain-reduction')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Pain Reduction</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{todaysMetrics.avgPainReduction}%</div>
            <p className="text-xs text-green-600">Treatment effectiveness</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-green-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common chiropractic workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-green-600 hover:bg-green-700" onClick={() => navigate('/schedule')}>
              <Clock className="w-4 h-4 mr-2" />
              Schedule Adjustment Session
            </Button>
            <Button variant="outline" className="w-full justify-start border-green-200 hover:bg-green-50" onClick={() => navigate('/ehr')}>
              <Activity className="w-4 h-4 mr-2" />
              Create SOAP Note
            </Button>
            <Button variant="outline" className="w-full justify-start border-green-200 hover:bg-green-50" onClick={() => navigate('/patient-management')}>
              <Users className="w-4 h-4 mr-2" />
              Add New Patient
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
            <CardDescription>Latest patient activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.map((patient, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-green-100 rounded-lg">
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-gray-600">{patient.condition}</p>
                    <p className="text-xs text-gray-500">{patient.lastVisit}</p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`${
                      patient.progress === 'Excellent' ? 'bg-green-100 text-green-800' :
                      patient.progress === 'Good' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {patient.progress}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
