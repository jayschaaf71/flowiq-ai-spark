
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Users, 
  Clock, 
  TrendingUp, 
  Activity,
  FileText,
  DollarSign,
  Phone,
  Mail,
  Bell,
  Settings,
  BarChart3,
  Shield,
  Zap,
  Brain,
  Mic,
  CreditCard,
  UserPlus,
  ClipboardList
} from "lucide-react";

export const ClinicDashboard = () => {
  const navigate = useNavigate();

  const quickStats = [
    { 
      label: "Today's Appointments", 
      value: "18", 
      icon: Calendar, 
      trend: "+5%",
      onClick: () => navigate("/schedule")
    },
    { 
      label: "Active Patients", 
      value: "1,247", 
      icon: Users, 
      trend: "+12%",
      onClick: () => navigate("/patients")
    },
    { 
      label: "Revenue Today", 
      value: "$3,420", 
      icon: DollarSign, 
      trend: "+8%",
      onClick: () => navigate("/claims")
    },
    { 
      label: "Efficiency Score", 
      value: "94%", 
      icon: TrendingUp, 
      trend: "+3%",
      onClick: () => navigate("/manager")
    }
  ];

  const aiAgents = [
    {
      name: "Scribe iQ",
      description: "AI-powered medical documentation",
      icon: Mic,
      color: "bg-blue-500",
      onClick: () => navigate("/agents/scribe-iq")
    },
    {
      name: "Schedule iQ",
      description: "Smart appointment scheduling",
      icon: Calendar,
      color: "bg-green-500",
      onClick: () => navigate("/schedule")
    },
    {
      name: "Remind iQ",
      description: "Automated patient reminders",
      icon: Bell,
      color: "bg-purple-500",
      onClick: () => navigate("/remind")
    },
    {
      name: "Intake iQ",
      description: "Digital patient intake forms",
      icon: ClipboardList,
      color: "bg-orange-500",
      onClick: () => navigate("/intake")
    }
  ];

  const quickActions = [
    {
      label: "Add New Patient",
      icon: UserPlus,
      onClick: () => navigate("/patients"),
      variant: "default" as const
    },
    {
      label: "Schedule Appointment",
      icon: Calendar,
      onClick: () => navigate("/schedule"),
      variant: "outline" as const
    },
    {
      label: "View Claims",
      icon: CreditCard,
      onClick: () => navigate("/claims"),
      variant: "outline" as const
    },
    {
      label: "Generate SOAP Note",
      icon: FileText,
      onClick: () => navigate("/agents/scribe-iq"),
      variant: "outline" as const
    }
  ];

  const recentActivity = [
    { 
      action: "Patient check-in completed", 
      time: "2 min ago", 
      status: "success",
      onClick: () => navigate("/patients")
    },
    { 
      action: "SOAP note generated via Scribe iQ", 
      time: "5 min ago", 
      status: "success",
      onClick: () => navigate("/agents/scribe-iq")
    },
    { 
      action: "Appointment reminder sent", 
      time: "10 min ago", 
      status: "success",
      onClick: () => navigate("/remind")
    },
    { 
      action: "Claims submitted successfully", 
      time: "15 min ago", 
      status: "pending",
      onClick: () => navigate("/claims")
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="w-8 h-8 text-blue-600" />
            Clinic Dashboard
          </h1>
          <p className="text-muted-foreground">
            Comprehensive practice management with AI-powered automation
          </p>
        </div>
        <Button onClick={() => navigate("/manager")}>
          <BarChart3 className="w-4 h-4 mr-2" />
          View Analytics
        </Button>
      </div>

      {/* Quick Stats - Now Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card 
            key={index} 
            className="cursor-pointer hover:shadow-md transition-shadow duration-200 hover:border-blue-300"
            onClick={stat.onClick}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3" />
                {stat.trend} from last week
              </div>
              <p className="text-xs text-blue-600 mt-1 opacity-75">Click to view details</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Agents Section - Now Clickable */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Agents
          </CardTitle>
          <CardDescription>
            Intelligent automation for your practice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiAgents.map((agent, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-md transition-shadow duration-200 hover:border-purple-300"
                onClick={agent.onClick}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${agent.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <agent.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm">{agent.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{agent.description}</p>
                  <p className="text-xs text-purple-600 mt-2 opacity-75">Click to access</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions - Now Clickable */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common practice management tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <Button 
                key={index}
                variant={action.variant}
                className="w-full justify-start"
                onClick={action.onClick}
              >
                <action.icon className="w-4 h-4 mr-2" />
                {action.label}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity - Now Clickable */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest practice updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={activity.onClick}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    <span className="text-sm font-medium">{activity.action}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                    <Badge variant={activity.status === 'success' ? 'default' : 'secondary'}>
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => navigate("/ehr")}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm">EHR Integration</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Active
              </Badge>
            </div>
            <div 
              className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => navigate("/agents/scribe-iq")}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm">AI Transcription</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Online
              </Badge>
            </div>
            <div 
              className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => navigate("/claims")}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm">Billing System</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Synced
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
