
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  Send, 
  Users, 
  Calendar,
  Phone,
  Mail,
  TrendingUp
} from "lucide-react";

export const RemindDashboard = () => {
  const stats = {
    messagesSent: 289,
    deliveryRate: 97,
    responseRate: 68,
    scheduledReminders: 42
  };

  const recentActivity = [
    { time: "2 min ago", action: "Sent appointment reminder to 15 patients", type: "sms", count: 15 },
    { time: "8 min ago", action: "Follow-up reminder for missed appointment", type: "email", count: 1 },
    { time: "15 min ago", action: "Pre-visit instructions sent", type: "sms", count: 8 },
    { time: "22 min ago", action: "Insurance reminder batch completed", type: "email", count: 12 },
    { time: "35 min ago", action: "Welcome message for new patients", type: "sms", count: 3 }
  ];

  const upcomingReminders = [
    { time: "In 15 min", task: "Appointment reminders for tomorrow", count: 23, type: "sms" },
    { time: "In 2 hours", task: "Follow-up care instructions", count: 8, type: "email" },
    { time: "Tomorrow 9 AM", task: "Weekly wellness tips", count: 156, type: "email" },
    { time: "Tomorrow 3 PM", task: "Prescription refill reminders", count: 12, type: "sms" }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sms": return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case "email": return <Mail className="w-4 h-4 text-green-600" />;
      case "call": return <Phone className="w-4 h-4 text-purple-600" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Messages Today</p>
                <p className="text-2xl font-bold">{stats.messagesSent}</p>
              </div>
              <Send className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Delivery Rate</p>
                <p className="text-2xl font-bold">{stats.deliveryRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <Progress value={stats.deliveryRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold">{stats.responseRate}%</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <Progress value={stats.responseRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">{stats.scheduledReminders}</p>
              </div>
              <Calendar className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest reminder and messaging actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  {getTypeIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge variant="outline">{activity.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Reminders */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Reminders</CardTitle>
            <CardDescription>Scheduled messaging tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingReminders.map((reminder, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(reminder.type)}
                    <Clock className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{reminder.task}</p>
                    <p className="text-xs text-muted-foreground">{reminder.time}</p>
                  </div>
                  <Badge>{reminder.count} patients</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common reminder management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Send className="w-5 h-5" />
              <span className="text-sm">Send Now</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calendar className="w-5 h-5" />
              <span className="text-sm">Schedule</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="w-5 h-5" />
              <span className="text-sm">Patient Groups</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
