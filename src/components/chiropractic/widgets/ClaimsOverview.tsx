
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, TrendingUp, AlertCircle, Clock } from "lucide-react";

export const ClaimsOverview = () => {
  const claimsData = {
    submitted: 24,
    approved: 18,
    denied: 3,
    pending: 3,
    totalValue: 12450
  };

  const denialReasons = [
    { reason: "Missing documentation", count: 2 },
    { reason: "Incorrect billing code", count: 1 }
  ];

  return (
    <Card className="border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-green-800 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Claims Overview
        </CardTitle>
        <CardDescription>
          This month's claims processing status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700">{claimsData.approved}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-700">{claimsData.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-700">{claimsData.denied}</div>
            <div className="text-sm text-gray-600">Denied</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">${claimsData.totalValue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Top Denial Reasons:</p>
          {denialReasons.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">{item.reason}</span>
              <Badge variant="secondary" className="text-xs">
                {item.count}
              </Badge>
            </div>
          ))}
        </div>
        
        <Button variant="outline" className="w-full mt-4 border-green-200 text-green-700 hover:bg-green-50">
          View All Claims
        </Button>
      </CardContent>
    </Card>
  );
};
