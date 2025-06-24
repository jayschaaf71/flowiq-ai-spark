
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, AlertCircle } from "lucide-react";

export const RevenueForecastTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          Revenue Forecast
        </CardTitle>
        <CardDescription>
          AI-powered revenue projections for the next 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">$52,400</div>
              <div className="text-sm text-muted-foreground">Next Month</div>
              <div className="text-xs text-green-600">95% confidence</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">$318,200</div>
              <div className="text-sm text-muted-foreground">Next Quarter</div>
              <div className="text-xs text-blue-600">87% confidence</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">$654,800</div>
              <div className="text-sm text-muted-foreground">Next 6 Months</div>
              <div className="text-xs text-purple-600">78% confidence</div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800">Forecast Factors</h4>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• Historical revenue trends show 2% monthly growth</li>
                  <li>• Seasonal adjustments for healthcare utilization patterns</li>
                  <li>• Payer mix changes and contract renewals</li>
                  <li>• Provider productivity and capacity planning</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
