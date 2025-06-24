
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileX, DollarSign, Zap, Target } from "lucide-react";

interface DenialMetricsCardsProps {
  denialAnalytics: any;
}

export const DenialMetricsCards = ({ denialAnalytics }: DenialMetricsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FileX className="w-4 h-4 text-red-600" />
            Total Denials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{denialAnalytics?.totalDenials || 0}</div>
          <div className="text-xs text-muted-foreground">Last 30 days</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-red-600" />
            Denied Amount
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${denialAnalytics?.totalDeniedAmount?.toLocaleString() || '0'}
          </div>
          <div className="text-xs text-muted-foreground">Total denied value</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-600" />
            Auto-Correctable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{denialAnalytics?.autoCorrectible || 0}</div>
          <div className="text-xs text-muted-foreground">
            {denialAnalytics?.totalDenials > 0 
              ? Math.round((denialAnalytics.autoCorrectible / denialAnalytics.totalDenials) * 100)
              : 0}% of denials
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="w-4 h-4 text-green-600" />
            Success Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{denialAnalytics?.autoCorrectRate?.toFixed(1) || '0'}%</div>
          <div className="text-xs text-muted-foreground">Auto-correction success</div>
        </CardContent>
      </Card>
    </div>
  );
};
