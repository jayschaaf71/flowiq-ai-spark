
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Bell, 
  MessageSquare, 
  Mail, 
  Phone, 
  CheckCircle,
  Clock,
  TrendingDown,
  Settings,
  Send,
  Calendar
} from "lucide-react";

const RemindIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const stats = {
    remindersSent: 156,
    responseRate: 87,
    noShowReduction: 42,
    scheduledReminders: 89,
    emailsSent: 124,
    smsSent: 67
  };

  const recentActivity = [
    { patient: "Sarah Wilson", type: "appointment", method: "SMS", status: "delivered", time: "2 min ago" },
    { patient: "John Doe", type: "follow-up", method: "Email", status: "opened", time: "8 min ago" },
    { patient: "Mary Johnson", type: "appointment", method: "Phone", status: "confirmed", time: "15 min ago" },
    { patient: "Robert Smith", type: "medication", method: "SMS", status: "delivered", time: "22 min ago" },
    { patient: "Lisa Brown", type: "annual checkup", method: "Email", status: "pending", time: "35 min ago" }
  ];

  const upcomingReminders = [
    { type: "Appointment reminders", count: 45, scheduled: "Today 6:00 PM", method: "SMS + Email" },
    { type: "Follow-up calls", count: 12, scheduled: "Tomorrow 9:00 AM", method: "Phone" },
    { type: "Medication refills", count: 8, scheduled: "Tomorrow 2:00 PM", method: "SMS" },
    { type: "Annual checkups", count: 23, scheduled: "This weekend", method: "Email" }
  ];

  const performanceMetrics = [
    { metric: "Email Open Rate", value: 76, target: 70, trend: "up" },
    { metric: "SMS Response Rate", value: 92, target: 85, trend: "up" },
    { metric: "Phone Answer Rate", value: 68, target: 75, trend: "down" },
    { metric: "No-Show Reduction", value: 42, target: 35, trend: "up" }
  ];

  return (
    <Layout>
      <PageHeader 
        title="Remind iQ"
        subtitle="Automated patient reminders and follow-up communications"
        badge="AI Agent"
      />
      
      <div className="p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reminders Sent</CardTitle>
              <Bell className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.remindersSent}</div>
              <p className="text-xs text-muted-foreground">+24 today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.responseRate}%</div>
              <Progress value={stats.responseRate} className="h-1 mt-1" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">No-Show Reduction</CardTitle>
              <TrendingDown className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.noShowReduction}%</div>
              <p className="text-xs text-muted-foreground">vs baseline</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.scheduledReminders}</div>
              <p className="text-xs text-muted-foreground">pending reminders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emails</CardTitle>
              <Mail className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.emailsSent}</div>
              <p className="text-xs text-muted-foreground">sent today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SMS</CardTitle>
              <MessageSquare className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.smsSent}</div>
              <p className="text-xs text-muted-foreground">sent today</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="reminders">Reminders</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4 mr-2" />
                Send Now
              </Button>
            </div>
          </div>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="text-sm font-medium">{activity.patient}</div>
                          <div className="text-xs text-muted-foreground">
                            {activity.type} reminder via {activity.method} • {activity.time}
                          </div>
                        </div>
                        <Badge 
                          className={
                            activity.status === "delivered" ? "bg-green-100 text-green-800" :
                            activity.status === "opened" || activity.status === "confirmed" ? "bg-blue-100 text-blue-800" :
                            "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Reminders */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Upcoming Reminders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingReminders.map((reminder, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{reminder.type}</span>
                          <Badge variant="outline">{reminder.count}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {reminder.scheduled} • {reminder.method}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {performanceMetrics.map((metric, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="text-sm font-medium mb-2">{metric.metric}</div>
                      <div className="text-2xl font-bold mb-1">{metric.value}%</div>
                      <div className="flex items-center gap-2">
                        <Progress value={metric.value} className="flex-1 h-2" />
                        <span className={`text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          Target: {metric.target}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reminders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reminder Management</CardTitle>
                <CardDescription>Schedule and manage patient reminders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-4" />
                  <p>Reminder management interface coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Message Templates</CardTitle>
                <CardDescription>Create and customize reminder message templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4" />
                  <p>Template editor coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reminder Analytics</CardTitle>
                <CardDescription>Response rates and communication effectiveness</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4" />
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

export default RemindIQ;
