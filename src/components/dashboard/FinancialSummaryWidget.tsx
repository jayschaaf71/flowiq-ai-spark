
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, CreditCard, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const FinancialSummaryWidget = () => {
  const navigate = useNavigate();

  const financialMetrics = [
    { label: "Today's Collections", value: "$8,450", trend: "+12%" },
    { label: "Claims Pending", value: "23", trend: "3 high priority" },
    { label: "Collection Rate", value: "94.8%", trend: "+2.1%" },
    { label: "A/R Days", value: "18.2", trend: "-3.2 days" }
  ];

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200" onClick={() => navigate('/financial')}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          Financial Overview
        </CardTitle>
        <CardDescription>Revenue cycle performance summary</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {financialMetrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="text-lg font-bold text-green-600">{metric.value}</div>
              <div className="text-xs text-gray-600">{metric.label}</div>
              <div className="text-xs text-green-600">{metric.trend}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <TrendingUp className="w-3 h-3 mr-1" />
              Revenue Up
            </Badge>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
              <AlertCircle className="w-3 h-3 mr-1" />
              3 Denials
            </Badge>
          </div>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
