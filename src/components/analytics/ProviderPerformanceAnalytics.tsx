
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const ProviderPerformanceAnalytics = () => {
  const providers = [
    {
      name: "Dr. Sarah Johnson",
      specialty: "Chiropractor",
      utilization: 92,
      appointments: 68,
      revenue: 12400,
      satisfaction: 4.8,
      initials: "SJ"
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Physical Therapist", 
      utilization: 87,
      appointments: 54,
      revenue: 9800,
      satisfaction: 4.6,
      initials: "MC"
    },
    {
      name: "Dr. Emily Rodriguez",
      specialty: "Massage Therapist",
      utilization: 78,
      appointments: 42,
      revenue: 7200,
      satisfaction: 4.9,
      initials: "ER"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Performance</CardTitle>
        <CardDescription>Monthly performance metrics by provider</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {providers.map((provider) => (
          <div key={provider.name} className="space-y-3 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{provider.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{provider.name}</div>
                  <div className="text-sm text-muted-foreground">{provider.specialty}</div>
                </div>
              </div>
              <Badge variant="outline">{provider.satisfaction}★</Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Utilization</div>
                <div className="font-medium">{provider.utilization}%</div>
                <Progress value={provider.utilization} className="mt-1" />
              </div>
              <div>
                <div className="text-muted-foreground">Appointments</div>
                <div className="font-medium">{provider.appointments}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Revenue</div>
                <div className="font-medium">${provider.revenue.toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
