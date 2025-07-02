
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSpecialty } from '@/contexts/SpecialtyContext';
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
  const { config } = useSpecialty();
  
  // Fallback config for ChiropracticIQ
  const dashboardConfig = {
    name: config?.brand_name || 'ChiropracticIQ',
    tagline: config?.tagline || 'Optimizing spinal health and mobility'
  };

  const todaysMetrics = {
    appointments: 12,
    newPatients: 3,
    revenue: 1250,
    avgPainReduction: 68
  };

  const recentPatients = [
    { name: 'John Smith', condition: 'Lower Back Pain', lastVisit: '2 hours ago', progress: 'Improving' },
    { name: 'Sarah Johnson', condition: 'Neck Strain', lastVisit: '1 day ago', progress: 'Good' },
    { name: 'Mike Wilson', condition: 'Sports Injury', lastVisit: '3 days ago', progress: 'Excellent' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-800">{dashboardConfig.name}</h1>
          <p className="text-green-600">{dashboardConfig.tagline}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Activity className="w-3 h-3 mr-1" />
            Chiropractic Care
          </Badge>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{todaysMetrics.appointments}</div>
            <p className="text-xs text-green-600">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Patients</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{todaysMetrics.newPatients}</div>
            <p className="text-xs text-green-600">This week</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">${todaysMetrics.revenue}</div>
            <p className="text-xs text-green-600">+12% from avg</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
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
            <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
              <Clock className="w-4 h-4 mr-2" />
              Schedule Adjustment Session
            </Button>
            <Button variant="outline" className="w-full justify-start border-green-200 hover:bg-green-50">
              <Activity className="w-4 h-4 mr-2" />
              Create SOAP Note
            </Button>
            <Button variant="outline" className="w-full justify-start border-green-200 hover:bg-green-50">
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
