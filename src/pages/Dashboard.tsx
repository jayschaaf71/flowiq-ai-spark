
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
import { EnhancedDashboardHeader } from "@/components/dashboard/EnhancedDashboardHeader";
import { RealTimeActivityFeed } from "@/components/dashboard/RealTimeActivityFeed";
import { SmartInsightsWidget } from "@/components/dashboard/SmartInsightsWidget";

export const Dashboard = () => {
  const navigate = useNavigate();

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

  const handleViewAllActivity = () => {
    navigate('/manager');
  };

  return (
    <div className="space-y-6">
      {/* Temporary test to show branding */}
      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-green-800">ChiropracticIQ</h2>
              <p className="text-green-600">Optimizing spinal health and mobility</p>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              Chiropractic Care
            </Badge>
          </div>
        </CardContent>
      </Card>

      <EnhancedDashboardHeader />

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

      {/* Enhanced Dashboard Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RealTimeActivityFeed />
        <SmartInsightsWidget />
      </div>
    </div>
  );
};

export default Dashboard;
