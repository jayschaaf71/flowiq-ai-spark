
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, Eye } from "lucide-react";

interface ComplianceMetric {
  name: string;
  score: number;
  status: 'compliant' | 'warning' | 'critical';
  details: string;
  lastChecked: string;
}

interface ComplianceMetricCardProps {
  metric: ComplianceMetric;
}

export const ComplianceMetricCard = ({ metric }: ComplianceMetricCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Eye className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      compliant: "default",
      warning: "secondary", 
      critical: "destructive"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
          {getStatusIcon(metric.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{metric.score}%</span>
            {getStatusBadge(metric.status)}
          </div>
          <Progress value={metric.score} className="h-2" />
          <p className="text-xs text-gray-600">{metric.details}</p>
          <p className="text-xs text-gray-500">
            Last checked: {new Date(metric.lastChecked).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
