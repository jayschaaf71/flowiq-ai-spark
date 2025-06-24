
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Calendar } from "lucide-react";
import { RevenueMetrics } from "@/services/revenueAnalytics";

interface RevenueOverviewTabProps {
  metrics: RevenueMetrics | null;
}

export const RevenueOverviewTab = ({ metrics }: RevenueOverviewTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Revenue Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Billed</span>
              <span className="text-lg font-bold">
                ${metrics?.totalBilled.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Collected</span>
              <span className="text-lg font-bold text-green-600">
                ${metrics?.totalCollected.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Collection Rate</span>
              <span className="text-lg font-bold">
                {metrics?.collectionRate.toFixed(1)}%
              </span>
            </div>
            <Progress value={metrics?.collectionRate || 0} className="mt-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            A/R Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Average Days in A/R</span>
              <span className="text-lg font-bold">
                {Math.round(metrics?.averageDaysInAR || 0)} days
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Working Days in A/R</span>
              <span className="text-lg font-bold">
                {Math.round(metrics?.workingDaysInAR || 0)} days
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Denial Rate</span>
              <span className="text-lg font-bold text-red-600">
                {metrics?.denialRate.toFixed(1)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
