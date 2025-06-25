
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

export const AISummary = () => {
  const insights = [
    {
      type: "performance",
      message: "Patient satisfaction increased 8% this week",
      icon: <TrendingUp className="w-4 h-4" />,
      color: "bg-green-100 text-green-800"
    },
    {
      type: "alert",
      message: "3 patients overdue for follow-up appointments",
      icon: <AlertCircle className="w-4 h-4" />,
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      type: "success",
      message: "All SOAP notes completed for yesterday",
      icon: <CheckCircle className="w-4 h-4" />,
      color: "bg-blue-100 text-blue-800"
    }
  ];

  return (
    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-green-800 flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Practice Insights
        </CardTitle>
        <CardDescription>
          Today's intelligent summary and recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-green-100">
            <div className="text-2xl font-bold text-green-700">18</div>
            <div className="text-sm text-gray-600">Appointments Today</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-green-100">
            <div className="text-2xl font-bold text-green-700">94%</div>
            <div className="text-sm text-gray-600">Show Rate</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-green-100">
            <div className="text-2xl font-bold text-green-700">$2,450</div>
            <div className="text-sm text-gray-600">Revenue Today</div>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-green-100">
              <Badge className={`${insight.color} p-1`}>
                {insight.icon}
              </Badge>
              <span className="text-sm text-gray-700">{insight.message}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
