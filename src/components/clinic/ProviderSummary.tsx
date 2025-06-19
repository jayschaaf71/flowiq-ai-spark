
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, Users, DollarSign, Star } from "lucide-react";

interface Provider {
  id: string;
  name: string;
  appointmentsToday: number;
  revenue: number;
  utilizationRate: number;
  avgRating: number;
  status: 'active' | 'break' | 'offline';
}

export const ProviderSummary = () => {
  const providers: Provider[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      appointmentsToday: 12,
      revenue: 1240,
      utilizationRate: 85,
      avgRating: 4.8,
      status: 'active'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      appointmentsToday: 10,
      revenue: 980,
      utilizationRate: 78,
      avgRating: 4.7,
      status: 'active'
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      appointmentsToday: 8,
      revenue: 760,
      utilizationRate: 65,
      avgRating: 4.9,
      status: 'break'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'break': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Summary - Today</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {providers.map((provider) => (
            <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{provider.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{provider.name}</h4>
                  <Badge className={getStatusColor(provider.status)} variant="secondary">
                    {provider.status}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{provider.appointmentsToday}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Appointments</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-medium">${provider.revenue}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">{provider.utilizationRate}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Utilization</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{provider.avgRating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
