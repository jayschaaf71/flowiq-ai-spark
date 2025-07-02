import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Smile, 
  Users, 
  Calendar, 
  TrendingUp,
  Brain,
  Clock,
  ArrowRight,
  Shield,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DentalDashboard: React.FC = () => {
  const navigate = useNavigate();

  const dentalMetrics = [
    {
      title: "Cleanings Today",
      value: "16",
      change: "+2 from yesterday",
      icon: Smile,
      color: "text-blue-600"
    },
    {
      title: "Treatment Plans",
      value: "34",
      change: "+8 this week",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Hygiene Score",
      value: "4.7/5",
      change: "+0.3 improvement",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Recall Compliance",
      value: "87%",
      change: "+12% this month",
      icon: Brain,
      color: "text-orange-600"
    }
  ];

  const dentalAreas = [
    {
      title: "Oral Health Assessment",
      description: "AI-powered dental imaging analysis and diagnosis support",
      icon: Brain,
      color: "text-blue-600",
      path: "/agents/scribe",
      metrics: ["14 X-rays analyzed", "98% accuracy rate", "1.8 min avg time"],
      badge: "AI Imaging"
    },
    {
      title: "Hygiene Scheduling",
      description: "Optimized recall scheduling and preventive care management",
      icon: Calendar,
      color: "text-green-600",
      path: "/agents/appointment",
      metrics: ["92% recall rate", "3.1 min avg booking", "8% no-show rate"],
      badge: "Preventive"
    },
    {
      title: "Treatment Planning",
      description: "Comprehensive care planning and financial coordination",
      icon: Shield,
      color: "text-purple-600",
      path: "/agents/claims",
      metrics: ["96% acceptance", "$2.4K avg plan", "89% insurance approval"],
      badge: "Financial"
    }
  ];

  const quickActions = [
    { label: "New Patient Exam", path: "/agents/intake", icon: Users },
    { label: "Perio Charting", path: "/agents/scribe", icon: Brain },
    { label: "Treatment Notes", path: "/ehr", icon: Smile },
    { label: "Recall Scheduling", path: "/agents/appointment", icon: Calendar }
  ];

  return (
    <div className="space-y-6">
      {/* Dental Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dentalMetrics.map((metric, index) => (
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

      {/* Dental-Specific Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {dentalAreas.map((area, index) => (
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
            <Clock className="w-5 h-5 text-blue-600" />
            Dental Quick Actions
          </CardTitle>
          <CardDescription>
            Fast access to common dental workflows
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