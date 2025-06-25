
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, FileText } from "lucide-react";

export const TodaysAppointments = () => {
  const appointments = [
    {
      id: 1,
      patient: "John Smith",
      time: "9:00 AM",
      type: "Initial Consultation",
      status: "confirmed",
      reason: "Lower back pain"
    },
    {
      id: 2,
      patient: "Sarah Johnson",
      time: "10:30 AM",
      type: "Follow-up",
      status: "checked-in",
      reason: "Neck adjustment"
    },
    {
      id: 3,
      patient: "Mike Wilson",
      time: "2:00 PM",
      type: "Treatment",
      status: "pending",
      reason: "Sports injury"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'checked-in': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-green-800 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Today's Appointments
        </CardTitle>
        <CardDescription>
          {appointments.length} appointments scheduled
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-3 border border-green-100 rounded-lg hover:bg-green-50 transition-colors">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">{appointment.patient}</p>
                  <p className="text-sm text-gray-600">{appointment.reason}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {appointment.time}
                  </p>
                  <p className="text-xs text-gray-500">{appointment.type}</p>
                </div>
                <Badge className={`text-xs ${getStatusColor(appointment.status)}`}>
                  {appointment.status}
                </Badge>
                <Button size="sm" variant="ghost" className="p-1">
                  <FileText className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4 border-green-200 text-green-700 hover:bg-green-50">
          View Full Schedule
        </Button>
      </CardContent>
    </Card>
  );
};
