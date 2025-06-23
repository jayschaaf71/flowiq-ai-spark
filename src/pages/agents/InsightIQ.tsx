
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIAgentPerformance } from "@/components/insights/AIAgentPerformance";
import { PredictiveAnalytics } from "@/components/insights/PredictiveAnalytics";
import { WorkflowOptimization } from "@/components/insights/WorkflowOptimization";
import { TrendingUp, Brain, BarChart3, Lightbulb } from "lucide-react";

const InsightIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Insight iQ"
        subtitle="AI-powered analytics, insights, and predictive recommendations"
        badge="AI Agent"
      />
      
      <div className="p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  AI Insights Dashboard
                </CardTitle>
                <CardDescription>
                  Comprehensive practice analytics and AI-powered recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Performance Metrics</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Track key practice indicators</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="font-medium">Predictive Analytics</span>
                    </div>
                    <p className="text-sm text-muted-foreground">AI-powered forecasting</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium">Smart Recommendations</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Actionable insights</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <AIAgentPerformance />
          </TabsContent>

          <TabsContent value="predictions" className="space-y-4">
            <PredictiveAnalytics />
          </TabsContent>

          <TabsContent value="optimization" className="space-y-4">
            <WorkflowOptimization />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Intelligence Reports</CardTitle>
                <CardDescription>Comprehensive practice intelligence and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                  <p>Intelligence reports coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InsightIQ;
