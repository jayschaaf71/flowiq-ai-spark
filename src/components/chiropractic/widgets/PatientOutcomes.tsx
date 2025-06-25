
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, TrendingDown } from "lucide-react";

export const PatientOutcomes = () => {
  const outcomes = [
    {
      patient: "John Smith",
      condition: "Lower Back Pain",
      improvement: 75,
      trend: "up",
      visits: 8
    },
    {
      patient: "Sarah Johnson",
      condition: "Neck Strain",
      improvement: 60,
      trend: "up",
      visits: 5
    },
    {
      patient: "Mike Wilson",
      condition: "Sports Injury",
      improvement: 45,
      trend: "down",
      visits: 3
    }
  ];

  return (
    <Card className="border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-green-800 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Patient Outcomes
        </CardTitle>
        <CardDescription>
          Treatment progress tracking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {outcomes.map((outcome, index) => (
            <div key={index} className="p-3 border border-green-100 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-gray-900">{outcome.patient}</p>
                  <p className="text-sm text-gray-600">{outcome.condition}</p>
                </div>
                <div className="flex items-center gap-2">
                  {outcome.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {outcome.visits} visits
                  </Badge>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    outcome.improvement >= 70 ? 'bg-green-600' :
                    outcome.improvement >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${outcome.improvement}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {outcome.improvement}% improvement
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
