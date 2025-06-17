
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity, Zap, Users, Clock } from "lucide-react";

export const MetricsOverview = () => {
  const metrics = [
    {
      title: "Active Workflows",
      value: "24",
      change: "+12%",
      trend: "up",
      icon: Activity,
      description: "Workflows running this month"
    },
    {
      title: "Efficiency Score",
      value: "89%",
      change: "+5%",
      trend: "up",
      icon: Zap,
      description: "Average automation efficiency"
    },
    {
      title: "Time Saved",
      value: "142h",
      change: "+23%",
      trend: "up",
      icon: Clock,
      description: "Hours saved this month"
    },
    {
      title: "Team Members",
      value: "12",
      change: "+2",
      trend: "up",
      icon: Users,
      description: "Active team members"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
              <span>from last month</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
