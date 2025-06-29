
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  Activity, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Brain,
  DollarSign,
  Heart,
  Shield,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const navigate = useNavigate();

  const quickStats = [
    { label: "Today's Appointments", value: "12", icon: Calendar, trend: "+8%" },
    { label: "Active Patients", value: "847", icon: Users, trend: "+15%" },
    { label: "AI Automations", value: "156", icon: Brain, trend: "+23%" },
    { label: "Efficiency Score", value: "94%", icon: TrendingUp, trend: "+5%" }
  ];

  const practiceAreas = [
    {
      title: "Financial Management",
      description: "Revenue cycle, claims, and payment processing",
      icon: DollarSign,
      color: "text-green-600",
      path: "/financial",
      metrics: ["$47K collected today", "91% auto-post rate", "18.2 days A/R"]
    },
    {
      title: "Patient Experience",
      description: "Satisfaction tracking and patient portal",
      icon: Heart,
      color: "text-pink-600",
      path: "/patient-experience",
      metrics: ["4.8/5 satisfaction", "89% portal usage", "2.3 min response time"]
    },
    {
      title: "Compliance & Security",
      description: "HIPAA compliance and security monitoring",
      icon: Shield,
      color: "text-blue-600",
      path: "/compliance",
      metrics: ["98% HIPAA score", "94% security audit", "100% data backup"]
    }
  ];

  const recentActivity = [
    { action: "Patient check-in automated", time: "2 min ago", status: "success" },
    { action: "SOAP note generated", time: "5 min ago", status: "success" },
    { action: "Appointment reminder sent", time: "10 min ago", status: "success" },
    { action: "Claims submitted", time: "15 min ago", status: "pending" }
  ];

  const handleViewAllActivity = () => {
    navigate('/manager');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-600" />
            FlowIQ Dashboard
          </h1>
          <p className="text-muted-foreground">
            AI-powered healthcare practice management overview
          </p>
        </div>
        <Button onClick={handleViewAllActivity}>
          <Activity className="w-4 h-4 mr-2" />
          View All Activity
        </Button>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index}>
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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Practice Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {practiceAreas.map((area, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <area.icon className={`w-5 h-5 ${area.color}`} />
                {area.title}
              </CardTitle>
              <CardDescription>{area.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {area.metrics.map((metric, idx) => (
                  <div key={idx} className="text-sm text-gray-600">
                    • {metric}
                  </div>
                ))}
              </div>
              <Button 
                onClick={() => navigate(area.path)}
                className="w-full"
                variant="outline"
              >
                View Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent AI Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent AI Activity</CardTitle>
          <CardDescription>Latest automated actions across your practice</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {activity.status === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-600" />
                  )}
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
  );
};

export default Dashboard;
