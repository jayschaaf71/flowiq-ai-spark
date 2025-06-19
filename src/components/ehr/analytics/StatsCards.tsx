
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, FileText, Shield } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ComponentType<{ className?: string }>;
}

const StatCard = ({ title, value, change, changeType, icon: Icon }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">
        <span className={`${
          changeType === 'positive' ? 'text-green-600' : 'text-red-600'
        }`}>
          {change}
        </span>
        {" "}from last month
      </p>
    </CardContent>
  </Card>
);

export const StatsCards = () => {
  const stats = [
    {
      title: "Total Patient Records",
      value: "1,247",
      change: "+12%",
      changeType: "positive" as const,
      icon: Users
    },
    {
      title: "SOAP Notes This Month", 
      value: "378",
      change: "+18%",
      changeType: "positive" as const,
      icon: FileText
    },
    {
      title: "Compliance Score",
      value: "98.2%",
      change: "+0.5%",
      changeType: "positive" as const,
      icon: Shield
    },
    {
      title: "Average Note Completion",
      value: "4.2 min",
      change: "-15%",
      changeType: "positive" as const,
      icon: TrendingUp
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};
