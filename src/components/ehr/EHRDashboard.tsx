
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  Calendar, 
  TrendingUp,
  Search,
  Plus,
  Activity,
  Clock
} from "lucide-react";

export const EHRDashboard = () => {
  const stats = [
    {
      title: "Total Patients",
      value: "1,247",
      change: "+12%",
      changeType: "positive" as const,
      icon: Users
    },
    {
      title: "SOAP Notes Today",
      value: "34",
      change: "+8%",
      changeType: "positive" as const,
      icon: FileText
    },
    {
      title: "Appointments",
      value: "18",
      change: "-5%",
      changeType: "negative" as const,
      icon: Calendar
    },
    {
      title: "Compliance Score",
      value: "98%",
      change: "+2%",
      changeType: "positive" as const,
      icon: TrendingUp
    }
  ];

  const recentActivity = [
    {
      patient: "Sarah Johnson",
      action: "SOAP note created",
      time: "5 minutes ago",
      provider: "Dr. Smith"
    },
    {
      patient: "Mike Chen",
      action: "Patient record updated",
      time: "12 minutes ago",
      provider: "Dr. Johnson"
    },
    {
      patient: "Lisa Williams",
      action: "Visit completed",
      time: "25 minutes ago",
      provider: "Dr. Smith"
    },
    {
      patient: "Robert Davis",
      action: "Insurance updated",
      time: "1 hour ago",
      provider: "Front Desk"
    }
  ];

  const pendingTasks = [
    {
      task: "Review unsigned notes",
      count: 5,
      priority: "high" as const,
      dueTime: "End of day"
    },
    {
      task: "Complete patient summaries",
      count: 8,
      priority: "medium" as const,
      dueTime: "Tomorrow"
    },
    {
      task: "Update insurance verifications",
      count: 12,
      priority: "low" as const,
      dueTime: "This week"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={`${
                    stat.changeType === 'positive' ? 'text-green-600' :
                    stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.change}
                  </span>
                  {" "}from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest patient record updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{activity.patient}</p>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                    <span>•</span>
                    <span>{activity.provider}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Pending Tasks
            </CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{task.task}</p>
                    <Badge 
                      variant={task.priority === 'high' ? 'destructive' : 
                              task.priority === 'medium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Due: {task.dueTime}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {task.count}
                </Badge>
              </div>
            ))}
            <Button className="w-full mt-4" variant="outline">
              View All Tasks
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used EHR functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col gap-2">
              <Plus className="h-5 w-5" />
              New Patient
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Search className="h-5 w-5" />
              Search Records
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <FileText className="h-5 w-5" />
              Create SOAP Note
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Calendar className="h-5 w-5" />
              Schedule Visit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
