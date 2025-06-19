
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Users, Calendar, Clock, AlertTriangle, CheckCircle } from "lucide-react";

export const ClinicMetrics = () => {
  const metrics = [
    {
      title: "Daily Revenue",
      value: "$4,280",
      change: "+12%",
      trend: "up",
      icon: DollarSign,
      description: "Revenue today vs yesterday"
    },
    {
      title: "Appointments Today",
      value: "32",
      change: "+5",
      trend: "up",
      icon: Calendar,
      description: "Scheduled appointments"
    },
    {
      title: "Patient Flow",
      value: "28",
      change: "+3",
      trend: "up",
      icon: Users,
      description: "Patients seen today"
    },
    {
      title: "Avg Wait Time",
      value: "8 min",
      change: "-2 min",
      trend: "up",
      icon: Clock,
      description: "Average patient wait time"
    },
    {
      title: "No-Shows",
      value: "3",
      change: "-1",
      trend: "up",
      icon: AlertTriangle,
      description: "Missed appointments today"
    },
    {
      title: "Completion Rate",
      value: "94%",
      change: "+2%",
      trend: "up",
      icon: CheckCircle,
      description: "Treatment completion rate"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              {metric.trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-emerald-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={metric.trend === "up" ? "text-emerald-600" : "text-red-600"}>
                {metric.change}
              </span>
              <span>vs yesterday</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
