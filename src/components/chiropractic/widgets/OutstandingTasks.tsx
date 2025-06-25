
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileText, Clock, CheckCircle } from "lucide-react";

export const OutstandingTasks = () => {
  const tasks = [
    {
      id: 1,
      type: "SOAP Note",
      patient: "John Smith",
      dueDate: "Today",
      priority: "high"
    },
    {
      id: 2,
      type: "Treatment Plan",
      patient: "Sarah Johnson",
      dueDate: "Tomorrow",
      priority: "medium"
    },
    {
      id: 3,
      type: "Insurance Form",
      patient: "Mike Wilson",
      dueDate: "Today",
      priority: "low"
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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-3 h-3" />;
      case 'medium': return <Clock className="w-3 h-3" />;
      case 'low': return <CheckCircle className="w-3 h-3" />;
      default: return <FileText className="w-3 h-3" />;
    }
  };

  return (
    <Card className="border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-green-800 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Outstanding Tasks
        </CardTitle>
        <CardDescription>
          {tasks.length} tasks requiring attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 border border-green-100 rounded-lg hover:bg-green-50 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{task.type}</p>
                <p className="text-sm text-gray-600">{task.patient}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-xs text-gray-500">Due: {task.dueDate}</p>
                </div>
                <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                  {getPriorityIcon(task.priority)}
                  <span className="ml-1">{task.priority}</span>
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4 border-green-200 text-green-700 hover:bg-green-50">
          View All Tasks
        </Button>
      </CardContent>
    </Card>
  );
};
