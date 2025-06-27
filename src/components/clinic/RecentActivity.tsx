
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Calendar, 
  Users, 
  CreditCard, 
  Clock,
  ArrowRight,
  Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const RecentActivity = () => {
  const navigate = useNavigate();

  const activities = [
    {
      id: 1,
      type: "appointment",
      title: "New appointment scheduled",
      description: "Dr. Smith - Patient consultation",
      time: "2 minutes ago",
      status: "scheduled",
      icon: Calendar,
      onClick: () => navigate("/schedule")
    },
    {
      id: 2,
      type: "patient",
      title: "Patient check-in completed",
      description: "John Doe - Routine checkup",
      time: "5 minutes ago",
      status: "completed",
      icon: Users,
      onClick: () => navigate("/patient-management")
    },
    {
      id: 3,
      type: "claim",
      title: "Insurance claim processed",
      description: "Claim #INS-2024-001 approved",
      time: "10 minutes ago",
      status: "approved",
      icon: CreditCard,
      onClick: () => navigate("/agents/claims-iq")
    },
    {
      id: 4,
      type: "soap",
      title: "SOAP note generated",
      description: "AI-generated documentation ready",
      time: "15 minutes ago",
      status: "ready",
      icon: FileText,
      onClick: () => navigate("/agents/scribe-iq")
    },
    {
      id: 5,
      type: "reminder",
      title: "Appointment reminder sent",
      description: "Tomorrow's appointments notified",
      time: "20 minutes ago",
      status: "sent",
      icon: Clock,
      onClick: () => navigate("/agents/remind-iq")
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Recent Activity
        </CardTitle>
        <CardDescription>
          Latest updates and actions across your practice
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div 
              key={activity.id}
              className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={activity.onClick}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <activity.icon className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">{activity.title}</p>
                  <p className="text-xs text-gray-600">{activity.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">{activity.time}</span>
                <Badge 
                  variant={activity.status === 'approved' || activity.status === 'completed' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {activity.status}
                </Badge>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate("/manager")}
          >
            View All Activity
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
