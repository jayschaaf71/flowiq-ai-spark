import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp,
  Brain,
  Bot,
  ArrowRight,
  Mic,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AppointmentDashboard: React.FC = () => {
  const navigate = useNavigate();

  const appointmentMetrics = [
    {
      title: "Bookings Today",
      value: "47",
      change: "+12 from yesterday",
      icon: Calendar,
      color: "text-indigo-600"
    },
    {
      title: "AI Conflicts Resolved",
      value: "23",
      change: "Auto-resolved",
      icon: Brain,
      color: "text-purple-600"
    },
    {
      title: "Voice Bookings",
      value: "18",
      change: "38% of total",
      icon: Mic,
      color: "text-blue-600"
    },
    {
      title: "Booking Speed",
      value: "1.2 min",
      change: "-30s improvement",
      icon: Zap,
      color: "text-green-600"
    }
  ];

  const appointmentAreas = [
    {
      title: "AI Scheduling Engine",
      description: "Intelligent appointment optimization with conflict resolution",
      icon: Brain,
      color: "text-indigo-600",
      path: "/agents/appointment",
      metrics: ["94% optimization rate", "Zero double-bookings", "Real-time conflicts"],
      badge: "Core AI"
    },
    {
      title: "Voice Booking System",
      description: "Natural language appointment booking with voice recognition",
      icon: Mic,
      color: "text-purple-600",
      path: "/agents/appointment",
      metrics: ["96% accuracy", "15+ languages", "2.1 min avg booking"],
      badge: "Voice AI"
    },
    {
      title: "Waitlist Management",
      description: "Smart waitlist with automated notifications and preferences",
      icon: Users,
      color: "text-blue-600",
      path: "/agents/appointment",
      metrics: ["78% conversion", "Auto-notifications", "Smart matching"],
      badge: "Automation"
    }
  ];

  const quickActions = [
    { label: "Book Appointment", path: "/agents/appointment", icon: Calendar },
    { label: "Voice Booking", path: "/agents/appointment", icon: Mic },
    { label: "Manage Waitlist", path: "/agents/appointment", icon: Users },
    { label: "View Calendar", path: "/schedule", icon: Clock }
  ];

  return (
    <div className="space-y-6">
      {/* Appointment Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {appointmentMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AppointmentIQ-Specific Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {appointmentAreas.map((area, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <area.icon className={`w-5 h-5 ${area.color}`} />
                  {area.title}
                </div>
                <Badge variant="secondary">{area.badge}</Badge>
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
                Access Tool
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-600" />
            AppointmentIQ Quick Actions
          </CardTitle>
          <CardDescription>
            AI-powered scheduling tools and features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-20 flex-col gap-2"
                onClick={() => navigate(action.path)}
              >
                <action.icon className="w-6 h-6" />
                <span className="text-xs text-center">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};