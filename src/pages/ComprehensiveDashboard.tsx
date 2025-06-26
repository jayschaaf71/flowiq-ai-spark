
import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, Calendar, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

export const ComprehensiveDashboard = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Comprehensive Dashboard"
        subtitle="Complete overview of all practice operations and AI agent performance"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold">34</p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue This Month</p>
                <p className="text-2xl font-bold">$89,420</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Efficiency</p>
                <p className="text-2xl font-bold">94%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Agent Status</CardTitle>
            <CardDescription>Real-time status of all AI agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Schedule iQ", status: "active", performance: "98%" },
                { name: "Intake iQ", status: "active", performance: "95%" },
                { name: "Remind iQ", status: "active", performance: "92%" },
                { name: "Scribe iQ", status: "active", performance: "89%" },
                { name: "Claims iQ", status: "active", performance: "94%" },
                { name: "Inventory iQ", status: "active", performance: "91%" },
              ].map((agent) => (
                <div key={agent.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium">{agent.name}</span>
                    <Badge variant="secondary">{agent.status}</Badge>
                  </div>
                  <span className="text-sm text-gray-600">{agent.performance}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system activities and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Low inventory alert</p>
                  <p className="text-xs text-gray-600">Surgical gloves running low - 12 units remaining</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Appointment confirmed</p>
                  <p className="text-xs text-gray-600">John Smith confirmed for 2:00 PM today</p>
                  <p className="text-xs text-gray-500">5 minutes ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComprehensiveDashboard;
