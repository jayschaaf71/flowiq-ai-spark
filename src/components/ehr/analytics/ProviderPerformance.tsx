
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Clock, Users, FileText } from "lucide-react";

export const ProviderPerformance = () => {
  const providers = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Physical Therapy",
      patients: 156,
      avgRating: 4.8,
      completionTime: "3.2 min",
      notesCompleted: 89,
      utilization: 92
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Sports Medicine",
      patients: 134,
      avgRating: 4.7,
      completionTime: "4.1 min",
      notesCompleted: 76,
      utilization: 88
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Rehabilitation",
      patients: 142,
      avgRating: 4.9,
      completionTime: "2.8 min",
      notesCompleted: 95,
      utilization: 94
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Performance</CardTitle>
        <CardDescription>Key metrics for healthcare providers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {providers.map((provider) => (
            <div key={provider.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{provider.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{provider.name}</h4>
                    <p className="text-sm text-muted-foreground">{provider.specialty}</p>
                  </div>
                </div>
                <Badge variant={provider.utilization >= 90 ? "default" : "secondary"}>
                  {provider.utilization}% utilization
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{provider.patients}</span>
                  </div>
                  <p className="text-muted-foreground">Patients</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{provider.avgRating}</span>
                  </div>
                  <p className="text-muted-foreground">Rating</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{provider.completionTime}</span>
                  </div>
                  <p className="text-muted-foreground">Avg Time</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <FileText className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">{provider.notesCompleted}%</span>
                  </div>
                  <p className="text-muted-foreground">Notes Complete</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
