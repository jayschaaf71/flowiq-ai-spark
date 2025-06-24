
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSpecialty } from '@/contexts/SpecialtyContext';
import { 
  Zap, 
  Users, 
  Calendar, 
  TrendingUp,
  Activity,
  Clock,
  DollarSign,
  Target
} from "lucide-react";

export const HRTDashboard = () => {
  const { config } = useSpecialty();

  const todaysMetrics = {
    appointments: 10,
    activePatients: 85,
    revenue: 2850,
    optimalLevels: 78
  };

  const recentPatients = [
    { name: 'Mark Johnson', treatment: 'Testosterone Pellets', lastVisit: '2 hours ago', improvement: 'Excellent' },
    { name: 'Susan Davis', treatment: 'Estrogen Therapy', lastVisit: '1 day ago', improvement: 'Good' },
    { name: 'Robert Wilson', treatment: 'Thyroid Optimization', lastVisit: '3 days ago', improvement: 'Improving' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-red-800">{config.name}</h1>
          <p className="text-red-600">{config.tagline}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <Zap className="w-3 h-3 mr-1" />
            Hormone Therapy
          </Badge>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{todaysMetrics.appointments}</div>
            <p className="text-xs text-red-600">Hormone consultations</p>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{todaysMetrics.activePatients}</div>
            <p className="text-xs text-red-600">On hormone therapy</p>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">${todaysMetrics.revenue}</div>
            <p className="text-xs text-red-600">Treatments & pellets</p>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimal Levels</CardTitle>
            <Target className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{todaysMetrics.optimalLevels}%</div>
            <p className="text-xs text-red-600">Patients in range</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-red-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>Hormone therapy workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-red-600 hover:bg-red-700">
              <Clock className="w-4 h-4 mr-2" />
              Schedule HRT Consultation
            </Button>
            <Button variant="outline" className="w-full justify-start border-red-200 hover:bg-red-50">
              <Activity className="w-4 h-4 mr-2" />
              Review Lab Results
            </Button>
            <Button variant="outline" className="w-full justify-start border-red-200 hover:bg-red-50">
              <Target className="w-4 h-4 mr-2" />
              Pellet Insertion
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
            <CardDescription>Hormone therapy progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.map((patient, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-red-100 rounded-lg">
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-gray-600">{patient.treatment}</p>
                    <p className="text-xs text-gray-500">{patient.lastVisit}</p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`${
                      patient.improvement === 'Excellent' ? 'bg-green-100 text-green-800' :
                      patient.improvement === 'Good' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {patient.improvement}
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
