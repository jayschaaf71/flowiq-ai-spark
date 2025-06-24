
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSpecialty } from '@/contexts/SpecialtyContext';
import { 
  Sparkles, 
  Users, 
  Calendar, 
  TrendingUp,
  Zap,
  Clock,
  DollarSign,
  Star
} from "lucide-react";

export const MedSpaDashboard = () => {
  const { config } = useSpecialty();

  const todaysMetrics = {
    appointments: 15,
    treatments: 22,
    revenue: 4250,
    satisfaction: 98
  };

  const recentTreatments = [
    { name: 'Amanda White', treatment: 'Botox + Fillers', lastVisit: '30 min ago', satisfaction: 5 },
    { name: 'Jessica Moore', treatment: 'Laser Facial', lastVisit: '2 hours ago', satisfaction: 5 },
    { name: 'Rachel Davis', treatment: 'CoolSculpting', lastVisit: '1 day ago', satisfaction: 4 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-pink-800">{config.name}</h1>
          <p className="text-pink-600">{config.tagline}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-pink-100 text-pink-800">
            <Sparkles className="w-3 h-3 mr-1" />
            Aesthetic Medicine
          </Badge>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-pink-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-700">{todaysMetrics.appointments}</div>
            <p className="text-xs text-pink-600">Aesthetic treatments</p>
          </CardContent>
        </Card>

        <Card className="border-pink-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treatments Done</CardTitle>
            <Zap className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-700">{todaysMetrics.treatments}</div>
            <p className="text-xs text-pink-600">Today</p>
          </CardContent>
        </Card>

        <Card className="border-pink-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-700">${todaysMetrics.revenue}</div>
            <p className="text-xs text-pink-600">+18% from avg</p>
          </CardContent>
        </Card>

        <Card className="border-pink-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction Score</CardTitle>
            <Star className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-700">{todaysMetrics.satisfaction}%</div>
            <p className="text-xs text-pink-600">Client happiness</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>Aesthetic treatment workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-pink-600 hover:bg-pink-700">
              <Clock className="w-4 h-4 mr-2" />
              Schedule Consultation
            </Button>
            <Button variant="outline" className="w-full justify-start border-pink-200 hover:bg-pink-50">
              <Zap className="w-4 h-4 mr-2" />
              Book Botox Treatment
            </Button>
            <Button variant="outline" className="w-full justify-start border-pink-200 hover:bg-pink-50">
              <Star className="w-4 h-4 mr-2" />
              Treatment Follow-up
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Treatments</CardTitle>
            <CardDescription>Latest client visits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTreatments.map((treatment, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-pink-100 rounded-lg">
                  <div>
                    <p className="font-medium">{treatment.name}</p>
                    <p className="text-sm text-gray-600">{treatment.treatment}</p>
                    <p className="text-xs text-gray-500">{treatment.lastVisit}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(treatment.satisfaction)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-pink-500 text-pink-500" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
