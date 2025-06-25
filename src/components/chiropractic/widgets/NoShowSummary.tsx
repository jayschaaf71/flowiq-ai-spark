
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserX, Phone, MessageSquare } from "lucide-react";

export const NoShowSummary = () => {
  const noShows = [
    {
      id: 1,
      patient: "Tom Davis",
      scheduledTime: "11:00 AM",
      status: "no-show",
      lastContact: "2 days ago"
    },
    {
      id: 2,
      patient: "Lisa Brown",
      scheduledTime: "3:00 PM",
      status: "cancelled",
      lastContact: "1 hour ago"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'no-show': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-green-800 flex items-center gap-2">
          <UserX className="w-5 h-5" />
          No-Shows & Cancellations
        </CardTitle>
        <CardDescription>
          {noShows.length} appointments need follow-up
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {noShows.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 border border-green-100 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{item.patient}</p>
                <p className="text-sm text-gray-600">
                  Scheduled: {item.scheduledTime}
                </p>
                <p className="text-xs text-gray-500">
                  Last contact: {item.lastContact}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                  {item.status}
                </Badge>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="p-1">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="p-1">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {noShows.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <UserX className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No missed appointments today!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
