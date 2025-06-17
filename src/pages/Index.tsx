
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Zap, TrendingUp, Users, Settings, MessageSquare, Plus, ChevronRight } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { WorkflowCard } from "@/components/WorkflowCard";
import { AIAssistant } from "@/components/AIAssistant";
import { MetricsOverview } from "@/components/MetricsOverview";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const recentWorkflows = [
    {
      id: 1,
      name: "Customer Onboarding Flow",
      status: "active",
      efficiency: 94,
      lastRun: "2 hours ago",
      description: "Automated customer onboarding with AI-powered personalization"
    },
    {
      id: 2,
      name: "Lead Qualification Pipeline",
      status: "optimization",
      efficiency: 87,
      lastRun: "1 day ago",
      description: "AI-enhanced lead scoring and routing system"
    },
    {
      id: 3,
      name: "Content Review Workflow",
      status: "active",
      efficiency: 91,
      lastRun: "30 minutes ago",
      description: "Intelligent content moderation and approval process"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 ml-64">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back, Alex
              </h1>
              <p className="text-gray-600 mt-1">Let's optimize your workflows with AI intelligence</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="relative hover:bg-blue-50 transition-colors"
              >
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                  3
                </Badge>
              </Button>
              
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  AX
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Metrics Overview */}
          <MetricsOverview />

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Plus className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Create Workflow</h3>
                    <p className="text-sm text-gray-600">Build intelligent automation</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <Zap className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Optimization</h3>
                    <p className="text-sm text-gray-600">Enhance existing flows</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Analytics</h3>
                    <p className="text-sm text-gray-600">View performance insights</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Workflows */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Workflows</h2>
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                View all
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {recentWorkflows.map((workflow) => (
                <WorkflowCard key={workflow.id} workflow={workflow} />
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Track your team's workflow interactions and AI optimizations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">
                    <strong>Customer Onboarding Flow</strong> was optimized by AI
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                  <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm">
                    <strong>Lead Qualification Pipeline</strong> completed 15 new leads
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">4 hours ago</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">
                    <strong>Sarah Wilson</strong> created a new workflow template
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* AI Chat Assistant */}
        <Button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200"
          size="icon"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>

        <AIAssistant isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </div>
  );
};

export default Index;
