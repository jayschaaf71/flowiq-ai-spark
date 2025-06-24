
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSpecialty } from '@/contexts/SpecialtyContext';
import { 
  Crown, 
  Users, 
  Calendar, 
  TrendingUp,
  Shield,
  Clock,
  DollarSign,
  Heart
} from "lucide-react";

export const ConciergeDashboard = () => {
  const { config } = useSpecialty();

  const todaysMetrics = {
    appointments: 6,
    executives: 15,
    revenue: 3200,
    healthScore: 94
  };

  const recentPatients = [
    { name: 'James Harrison', type: 'Executive Physical', lastVisit: '1 hour ago', riskLevel: 'Low' },
    { name: 'Patricia Williams', type: 'Wellness Consultation', lastVisit: '3 hours ago', riskLevel: 'Medium' },
    { name: 'Michael Chen', type: 'Preventive Care', lastVisit: '1 day ago', riskLevel: 'Low' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-purple-800">{config.name}</h1>
          <p className="text-purple-600">{config.tagline}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            <Crown className="w-3 h-3 mr-1" />
            Concierge Medicine
          </Badge>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{todaysMetrics.appointments}</div>
            <p className="text-xs text-purple-600">Executive care</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{todaysMetrics.executives}</div>
            <p className="text-xs text-purple-600">Concierge members</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">${todaysMetrics.revenue}</div>
            <p className="text-xs text-purple-600">Premium services</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Health Score</CardTitle>
            <Heart className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{todaysMetrics.healthScore}%</div>
            <p className="text-xs text-purple-600">Wellness optimization</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-purple-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>Executive healthcare workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700">
              <Clock className="w-4 h-4 mr-2" />
              Schedule Executive Physical
            </Button>
            <Button variant="outline" className="w-full justify-start border-purple-200 hover:bg-purple-50">
              <Shield className="w-4 h-4 mr-2" />
              Wellness Consultation
            </Button>
            <Button variant="outline" className="w-full justify-start border-purple-200 hover:bg-purple-50">
              <TrendingUp className="w-4 h-4 mr-2" />
              Health Risk Assessment
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Members</CardTitle>
            <CardDescription>Executive healthcare visits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.map((patient, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-purple-100 rounded-lg">
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-gray-600">{patient.type}</p>
                    <p className="text-xs text-gray-500">{patient.lastVisit}</p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`${
                      patient.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                      patient.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {patient.riskLevel} Risk
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
