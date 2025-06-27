
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Users, 
  DollarSign,
  FileText,
  Clock,
  Activity,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ClinicMetrics = () => {
  const navigate = useNavigate();

  const metrics = [
    {
      title: "Patient Volume",
      value: "1,247",
      change: "+12%",
      trend: "up",
      description: "Active patients this month",
      icon: Users,
      onClick: () => navigate("/patient-management")
    },
    {
      title: "Appointment Efficiency",
      value: "94%",
      change: "+3%",
      trend: "up",
      description: "On-time appointment rate",
      icon: Clock,
      onClick: () => navigate("/schedule")
    },
    {
      title: "Revenue Growth",
      value: "$45,230",
      change: "+8%",
      trend: "up",
      description: "Monthly recurring revenue",
      icon: DollarSign,
      onClick: () => navigate("/agents/claims-iq")
    },
    {
      title: "Claims Processing",
      value: "98.2%",
      change: "-0.5%",
      trend: "down",
      description: "Claims approval rate",
      icon: FileText,
      onClick: () => navigate("/agents/claims-iq")
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card 
          key={index}
          className="cursor-pointer hover:shadow-md transition-shadow duration-200 hover:border-blue-300"
          onClick={metric.onClick}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center justify-between mt-1">
              <div className={`flex items-center gap-1 text-xs ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {metric.change}
              </div>
              <Badge variant="outline" className="text-xs">
                {metric.trend === 'up' ? 'Improving' : 'Needs Attention'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
            <p className="text-xs text-blue-600 mt-1 opacity-75">Click to view details</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
