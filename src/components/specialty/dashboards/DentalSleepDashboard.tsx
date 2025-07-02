
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSpecialty } from '@/contexts/SpecialtyContext';
import { 
  Moon, 
  Users, 
  Calendar, 
  TrendingUp,
  Stethoscope,
  Clock,
  DollarSign,
  Activity
} from "lucide-react";

export const DentalSleepDashboard = () => {
  const { config } = useSpecialty();

  // Fallback config for demo purposes
  const displayConfig = config || {
    name: 'Dental Sleep Medicine Practice',
    tagline: 'Advanced sleep apnea treatment solutions'
  };

  const todaysMetrics = {
    appointments: 8,
    newConsults: 2,
    revenue: 2100,
    avgAHIReduction: 82
  };

  const recentPatients = [
    { name: 'Robert Chen', condition: 'Severe OSA', lastVisit: '1 hour ago', ahiReduction: '75%' },
    { name: 'Lisa Anderson', condition: 'Mild Sleep Apnea', lastVisit: '2 days ago', ahiReduction: '68%' },
    { name: 'David Parker', condition: 'CPAP Intolerance', lastVisit: '1 week ago', ahiReduction: '89%' }
  ];

  return (
    <div className="space-y-6">

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{todaysMetrics.appointments}</div>
            <p className="text-xs text-blue-600">Sleep consultations</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Consultations</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{todaysMetrics.newConsults}</div>
            <p className="text-xs text-blue-600">This week</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">${todaysMetrics.revenue}</div>
            <p className="text-xs text-blue-600">Appliance fittings</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg AHI Reduction</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{todaysMetrics.avgAHIReduction}%</div>
            <p className="text-xs text-blue-600">Treatment success</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-blue-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>Sleep medicine workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
              <Clock className="w-4 h-4 mr-2" />
              Schedule Sleep Consultation
            </Button>
            <Button variant="outline" className="w-full justify-start border-blue-200 hover:bg-blue-50">
              <Activity className="w-4 h-4 mr-2" />
              Review Sleep Study
            </Button>
            <Button variant="outline" className="w-full justify-start border-blue-200 hover:bg-blue-50">
              <Stethoscope className="w-4 h-4 mr-2" />
              Appliance Follow-up
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
            <CardDescription>Sleep therapy progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.map((patient, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-blue-100 rounded-lg">
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-gray-600">{patient.condition}</p>
                    <p className="text-xs text-gray-500">{patient.lastVisit}</p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="bg-blue-100 text-blue-800"
                  >
                    AHI -{patient.ahiReduction}
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
