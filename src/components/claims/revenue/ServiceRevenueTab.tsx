
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart } from "lucide-react";

export const ServiceRevenueTab = () => {
  const revenueByService = [
    { service: 'Office Visits', revenue: 145000, percentage: 38 },
    { service: 'Procedures', revenue: 98000, percentage: 26 },
    { service: 'Diagnostic Tests', revenue: 76000, percentage: 20 },
    { service: 'Consultations', revenue: 61000, percentage: 16 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-purple-600" />
          Revenue by Service Type
        </CardTitle>
        <CardDescription>
          Revenue distribution across different service categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {revenueByService.map((service, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{service.service}</span>
                <div className="text-right">
                  <div className="font-bold">${service.revenue.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">{service.percentage}%</div>
                </div>
              </div>
              <Progress value={service.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
