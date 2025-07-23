
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DenialAnalyticsTabProps {
  denialAnalytics: {
    trends?: Array<{ month: string; count: number }>;
    denialsByReason?: Array<{ reason: string; count: number }>;
    totalDenials?: number;
  } | null;
}

export const DenialAnalyticsTab = ({ denialAnalytics }: DenialAnalyticsTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Denial Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {denialAnalytics?.trends?.map((trend: { month: string; count: number }, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{trend.month}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{trend.count} denials</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Denial Reasons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {denialAnalytics?.denialsByReason?.slice(0, 5).map((item: { reason: string; count: number }, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{item.reason}</span>
                  <span className="font-medium">{item.count} claims</span>
                </div>
                <Progress value={(item.count / Math.max(denialAnalytics?.totalDenials || 1, 1)) * 100} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
