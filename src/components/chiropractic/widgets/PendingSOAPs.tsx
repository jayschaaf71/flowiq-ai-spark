
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, AlertCircle } from "lucide-react";

export const PendingSOAPs = () => {
  const pendingSOAPs = [
    {
      id: 1,
      patient: "John Smith",
      date: "Today",
      time: "9:00 AM",
      urgency: "high"
    },
    {
      id: 2,
      patient: "Sarah Johnson",
      date: "Yesterday",
      time: "2:30 PM",
      urgency: "medium"
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-green-800 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Pending SOAP Notes
        </CardTitle>
        <CardDescription>
          {pendingSOAPs.length} notes awaiting completion
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pendingSOAPs.map((soap) => (
            <div key={soap.id} className="flex items-center justify-between p-3 border border-green-100 rounded-lg hover:bg-green-50 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{soap.patient}</p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {soap.date} at {soap.time}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`text-xs ${getUrgencyColor(soap.urgency)}`}>
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {soap.urgency}
                </Badge>
                <Button size="sm" variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                  Complete
                </Button>
              </div>
            </div>
          ))}
        </div>
        {pendingSOAPs.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">All SOAP notes are up to date!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
