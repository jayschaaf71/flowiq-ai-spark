
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp,
  Activity,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QuickStats = () => {
  const navigate = useNavigate();

  const stats = [
    { 
      title: "Today's Appointments", 
      value: "18", 
      description: "5 more than yesterday",
      icon: Calendar,
      trend: "+5%",
      onClick: () => navigate("/schedule")
    },
    { 
      title: "Active Patients", 
      value: "1,247", 
      description: "12% increase this month",
      icon: Users,
      trend: "+12%",
      onClick: () => navigate("/patient-management")
    },
    { 
      title: "Revenue Today", 
      value: "$3,420", 
      description: "8% above target",
      icon: DollarSign,
      trend: "+8%",
      onClick: () => navigate("/agents/claims")
    },
    { 
      title: "Avg. Wait Time", 
      value: "8 min", 
      description: "2 min less than average",
      icon: Clock,
      trend: "-20%",
      onClick: () => navigate("/schedule")
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card 
          key={index}
          className="cursor-pointer hover:shadow-md transition-shadow duration-200 hover:border-blue-300"
          onClick={stat.onClick}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3" />
              {stat.trend} from last week
            </div>
            <p className="text-xs text-blue-600 mt-1 opacity-75">Click to view details</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
