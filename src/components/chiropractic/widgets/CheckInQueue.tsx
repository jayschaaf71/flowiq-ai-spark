
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock, CheckCircle } from "lucide-react";

export const CheckInQueue = () => {
  const queue = [
    {
      id: 1,
      patient: "Sarah Johnson",
      arrivedAt: "10:25 AM",
      status: "waiting",
      appointmentTime: "10:30 AM"
    },
    {
      id: 2,
      patient: "Tom Davis",
      arrivedAt: "10:45 AM",
      status: "ready",
      appointmentTime: "11:00 AM"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-green-800 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Check-In Queue
        </CardTitle>
        <CardDescription>
          {queue.length} patients waiting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {queue.map((patient) => (
            <div key={patient.id} className="flex items-center justify-between p-3 border border-green-100 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{patient.patient}</p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Arrived: {patient.arrivedAt}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`text-xs ${getStatusColor(patient.status)}`}>
                  {patient.status}
                </Badge>
                <Button size="sm" variant="ghost" className="p-1">
                  <CheckCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        {queue.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No patients in queue</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
