
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { RevenueKPI } from "@/services/revenueAnalytics";

interface RevenueKPIDashboardProps {
  kpis: RevenueKPI[];
}

export const RevenueKPIDashboard = ({ kpis }: RevenueKPIDashboardProps) => {
  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'days':
        return `${Math.round(value)} days`;
      default:
        return value.toLocaleString();
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <div className="w-4 h-4" />;
    }
  };

  const getKPIColor = (kpi: RevenueKPI) => {
    if (kpi.name === 'Days in A/R' || kpi.name === 'Denial Rate') {
      return kpi.current <= kpi.target ? 'text-green-600' : 'text-red-600';
    }
    return kpi.current >= kpi.target ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
              {getTrendIcon(kpi.trend)}
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getKPIColor(kpi)}`}>
              {formatValue(kpi.current, kpi.format)}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground">
                Target: {formatValue(kpi.target, kpi.format)}
              </span>
              <Badge variant={kpi.variance >= 0 ? "default" : "destructive"} className="text-xs">
                {kpi.variance > 0 ? '+' : ''}{formatValue(Math.abs(kpi.variance), kpi.format)}
              </Badge>
            </div>
            <Progress 
              value={kpi.name === 'Days in A/R' || kpi.name === 'Denial Rate' 
                ? Math.max(0, 100 - (kpi.current / kpi.target) * 100)
                : (kpi.current / kpi.target) * 100
              } 
              className="mt-2" 
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
