
import { Button } from "@/components/ui/button";
import { BarChart3, RefreshCw, Download } from "lucide-react";

interface RevenueAnalyticsHeaderProps {
  onRefresh: () => void;
}

export const RevenueAnalyticsHeader = ({ onRefresh }: RevenueAnalyticsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Comprehensive Revenue Analytics
        </h3>
        <p className="text-gray-600">
          Advanced revenue cycle analytics with KPI tracking and forecasting
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};
