
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, FileText } from "lucide-react";

export const PracticeMetrics = () => {
  const metrics = [
    {
      title: "Total Patients",
      value: "1,247",
      change: "+12%",
      trend: "up",
      icon: Users,
      period: "vs last month"
    },
    {
      title: "Appointments This Month",
      value: "342",
      change: "+8%",
      trend: "up",
      icon: Calendar,
      period: "vs last month"
    },
    {
      title: "Revenue (MTD)",
      value: "$47,580",
      change: "+15%",
      trend: "up",
      icon: DollarSign,
      period: "vs last month"
    },
    {
      title: "Claims Processed",
      value: "189",
      change: "-3%",
      trend: "down",
      icon: FileText,
      period: "vs last month"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
        
        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendIcon className={`h-3 w-3 ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                <Badge variant={metric.trend === 'up' ? 'default' : 'destructive'} className="text-xs">
                  {metric.change}
                </Badge>
                <span>{metric.period}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
