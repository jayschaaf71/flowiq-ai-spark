
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export const ComplianceAlerts = () => {
  const alerts = [
    {
      id: 1,
      type: "HIPAA",
      message: "Staff training due for 2 employees",
      severity: "medium",
      dueDate: "Next week"
    },
    {
      id: 2,
      type: "Documentation",
      message: "3 patient files missing signatures",
      severity: "high",
      dueDate: "Today"
    },
    {
      id: 3,
      type: "Equipment",
      message: "Annual safety inspection completed",
      severity: "success",
      dueDate: "Completed"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'success': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-3 h-3" />;
      case 'medium': return <Clock className="w-3 h-3" />;
      case 'success': return <CheckCircle className="w-3 h-3" />;
      default: return <AlertTriangle className="w-3 h-3" />;
    }
  };

  return (
    <Card className="border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-green-800 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Compliance Alerts
        </CardTitle>
        <CardDescription>
          Practice compliance monitoring
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 border border-green-100 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{alert.type}</p>
                <p className="text-sm text-gray-600">{alert.message}</p>
                <p className="text-xs text-gray-500">Due: {alert.dueDate}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>
                  {getSeverityIcon(alert.severity)}
                  <span className="ml-1">{alert.severity}</span>
                </Badge>
                {alert.severity !== 'success' && (
                  <Button size="sm" variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                    Review
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
