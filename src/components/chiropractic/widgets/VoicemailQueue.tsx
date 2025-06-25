
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Clock, Play } from "lucide-react";

export const VoicemailQueue = () => {
  const voicemails = [
    {
      id: 1,
      caller: "Mary Wilson",
      time: "10:30 AM",
      duration: "1:24",
      priority: "high",
      reason: "Pain increase"
    },
    {
      id: 2,
      caller: "Unknown",
      time: "9:45 AM",
      duration: "0:45",
      priority: "low",
      reason: "General inquiry"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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
          <Phone className="w-5 h-5" />
          Voicemail Queue
        </CardTitle>
        <CardDescription>
          {voicemails.length} messages need attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {voicemails.map((voicemail) => (
            <div key={voicemail.id} className="flex items-center justify-between p-3 border border-green-100 rounded-lg hover:bg-green-50 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{voicemail.caller}</p>
                <p className="text-sm text-gray-600">{voicemail.reason}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {voicemail.time} • {voicemail.duration}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`text-xs ${getPriorityColor(voicemail.priority)}`}>
                  {voicemail.priority}
                </Badge>
                <Button size="sm" variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                  <Play className="w-3 h-3 mr-1" />
                  Play
                </Button>
              </div>
            </div>
          ))}
        </div>
        {voicemails.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Phone className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No voicemails to review</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
