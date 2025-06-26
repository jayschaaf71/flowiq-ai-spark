
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponseHandler } from "./automation/ResponseHandler";
import { SmartScheduler } from "./automation/SmartScheduler";
import { EscalationWorkflows } from "./automation/EscalationWorkflows";
import { 
  Brain, 
  Zap, 
  AlertTriangle, 
  TrendingUp,
  MessageSquare,
  Clock
} from "lucide-react";

export const RemindAutomation = () => {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Response Rate</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimized Messages</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalations Resolved</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">
              Auto-resolution rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Automation Features */}
      <Tabs defaultValue="responses" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="responses" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Response Handler
          </TabsTrigger>
          <TabsTrigger value="scheduler" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Smart Scheduler
          </TabsTrigger>
          <TabsTrigger value="escalation" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Escalation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="responses">
          <ResponseHandler />
        </TabsContent>

        <TabsContent value="scheduler">
          <SmartScheduler />
        </TabsContent>

        <TabsContent value="escalation">
          <EscalationWorkflows />
        </TabsContent>
      </Tabs>
    </div>
  );
};
