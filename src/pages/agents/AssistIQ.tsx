
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  MessageSquare, 
  HelpCircle, 
  BookOpen, 
  Users, 
  Clock,
  CheckCircle,
  TrendingUp,
  Settings,
  Send,
  Search
} from "lucide-react";

const AssistIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const stats = {
    queriesHandled: 124,
    responseTime: 1.2,
    satisfactionRate: 96,
    activeChats: 8,
    knowledgeBase: 847,
    automatedResolutions: 89
  };

  const recentQueries = [
    { staff: "Dr. Sarah Wilson", query: "Patient consent form requirements", category: "Policy", status: "resolved", time: "5 min ago" },
    { staff: "Nurse John", query: "Insurance verification process", category: "Billing", status: "in-progress", time: "12 min ago" },
    { staff: "Receptionist Mary", query: "Appointment scheduling conflicts", category: "Scheduling", status: "resolved", time: "25 min ago" },
    { staff: "Dr. Robert Smith", query: "Lab result interpretation guidelines", category: "Clinical", status: "escalated", time: "45 min ago" },
    { staff: "Admin Lisa", query: "HIPAA compliance checklist", category: "Compliance", status: "resolved", time: "1 hour ago" }
  ];

  const topCategories = [
    { category: "Billing & Insurance", queries: 45, percentage: 36, avgTime: "2.1 min" },
    { category: "Scheduling", queries: 32, percentage: 26, avgTime: "1.8 min" },
    { category: "Clinical Guidelines", queries: 28, percentage: 23, avgTime: "3.2 min" },
    { category: "Compliance", queries: 19, percentage: 15, avgTime: "2.5 min" }
  ];

  const knowledgeMetrics = [
    { metric: "Articles", count: 847, trend: "+23 this week" },
    { metric: "FAQs", count: 156, trend: "+8 this week" },
    { metric: "Procedures", count: 234, trend: "+12 this week" },
    { metric: "Quick Links", count: 89, trend: "+3 this week" }
  ];

  return (
    <Layout>
      <PageHeader 
        title="Assist iQ"
        subtitle="AI assistant for staff support and queries"
        badge="AI Agent"
      />
      
      <div className="p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Queries Today</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.queriesHandled}</div>
              <p className="text-xs text-muted-foreground">+18 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.responseTime}s</div>
              <p className="text-xs text-muted-foreground">avg response</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
              <CheckCircle className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.satisfactionRate}%</div>
              <Progress value={stats.satisfactionRate} className="h-1 mt-1" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
              <Users className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.activeChats}</div>
              <p className="text-xs text-muted-foreground">ongoing conversations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Knowledge Base</CardTitle>
              <BookOpen className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.knowledgeBase}</div>
              <p className="text-xs text-muted-foreground">articles available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Auto-Resolved</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.automatedResolutions}%</div>
              <p className="text-xs text-muted-foreground">of queries</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="chat">Live Chat</TabsTrigger>
              <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Search KB
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </div>
          </div>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Queries */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Staff Queries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentQueries.map((query, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="text-sm font-medium">{query.staff}</div>
                          <div className="text-xs text-muted-foreground mb-1">{query.query}</div>
                          <div className="text-xs text-muted-foreground">{query.category} • {query.time}</div>
                        </div>
                        <Badge 
                          className={
                            query.status === "resolved" ? "bg-green-100 text-green-800" :
                            query.status === "in-progress" ? "bg-blue-100 text-blue-800" :
                            "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {query.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Query Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Query Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topCategories.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{category.category}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{category.queries}</Badge>
                            <span className="text-xs text-muted-foreground">{category.avgTime}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={category.percentage} className="flex-1 h-2" />
                          <span className="text-xs text-muted-foreground">{category.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Knowledge Base Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Knowledge Base Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {knowledgeMetrics.map((metric, index) => (
                    <div key={index} className="p-4 border rounded-lg text-center">
                      <div className="text-sm font-medium mb-2">{metric.metric}</div>
                      <div className="text-3xl font-bold mb-1">{metric.count.toLocaleString()}</div>
                      <div className="text-xs text-green-600">{metric.trend}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Live Chat Interface</CardTitle>
                <CardDescription>Real-time staff assistance and support</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4" />
                  <p>Live chat interface coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Base Management</CardTitle>
                <CardDescription>Manage articles, FAQs, and procedures</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-4" />
                  <p>Knowledge base management coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Support Analytics</CardTitle>
                <CardDescription>Query patterns and staff satisfaction metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                  <p>Analytics dashboard coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AssistIQ;
