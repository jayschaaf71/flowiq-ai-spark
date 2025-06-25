
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

export const DailyRevenue = () => {
  const revenue = {
    collected: 2450,
    expected: 2800,
    trend: 12.5,
    isPositive: true
  };

  const collectionRate = (revenue.collected / revenue.expected) * 100;

  return (
    <Card className="border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-green-800 flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Daily Revenue
        </CardTitle>
        <CardDescription>
          Collection rate: {collectionRate.toFixed(1)}%
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-700">
                ${revenue.collected.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Collected Today</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-600">
                ${revenue.expected.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Expected</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {revenue.isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
            <span className={`text-sm font-medium ${revenue.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {revenue.isPositive ? '+' : ''}{revenue.trend}% vs yesterday
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(collectionRate, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
