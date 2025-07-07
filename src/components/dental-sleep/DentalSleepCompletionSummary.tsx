import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle, 
  Moon, 
  Activity, 
  FileText, 
  Calendar,
  Package,
  CreditCard,
  User,
  Settings,
  ArrowRight
} from "lucide-react";

export const DentalSleepCompletionSummary = () => {
  const navigate = useNavigate();

  const completedFeatures = [
    {
      name: "Dental Sleep iQ Agent Hub",
      path: "/agents/dental-sleep",
      icon: Moon,
      status: "complete",
      description: "Main specialty management dashboard"
    },
    {
      name: "Sleep Study Manager",
      path: "/agents/dental-sleep",
      icon: Activity,
      status: "complete",
      description: "Polysomnography and HST tracking"
    },
    {
      name: "DME Tracker",
      path: "/agents/dental-sleep",
      icon: Package,
      status: "complete",
      description: "Oral appliance order management"
    },
    {
      name: "Sleep Medicine Templates",
      path: "/agents/dental-sleep",
      icon: FileText,
      status: "complete",
      description: "SOAP notes and billing codes"
    },
    {
      name: "Patient Portal",
      path: "/agents/dental-sleep",
      icon: User,
      status: "complete",
      description: "Dental sleep patient experience"
    },
    {
      name: "Specialty EHR",
      path: "/agents/dental-sleep",
      icon: Settings,
      status: "complete",
      description: "Sleep medicine workflow"
    },
    {
      name: "Claims Integration",
      path: "/agents/dental-sleep",
      icon: CreditCard,
      status: "complete",
      description: "E0486 and sleep medicine billing"
    },
    {
      name: "Scheduling Integration",
      path: "/agents/dental-sleep",
      icon: Calendar,
      status: "complete",
      description: "Sleep consultation scheduling"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Moon className="w-8 h-8 text-purple-600" />
          <h2 className="text-2xl font-bold text-purple-800">Dental Sleep iQ - Complete!</h2>
        </div>
        <p className="text-purple-600 mb-6">
          Your comprehensive sleep medicine practice management system is ready to use.
        </p>
        <div className="flex justify-center gap-4">
          <Button 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => navigate('/agents/dental-sleep')}
          >
            <Moon className="w-4 h-4 mr-2" />
            Launch Dental Sleep iQ
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/dental-sleep-demo')}
          >
            View Demo
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Implementation Complete
          </CardTitle>
          <CardDescription>
            All core Dental Sleep iQ features have been successfully implemented
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedFeatures.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-purple-50 cursor-pointer transition-colors"
                onClick={() => navigate(feature.path)}
              >
                <div className="flex items-center gap-3">
                  <feature.icon className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium text-sm">{feature.name}</div>
                    <div className="text-xs text-muted-foreground">{feature.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Complete
                  </Badge>
                  <ArrowRight className="w-4 h-4 text-purple-400" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-purple-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-800">Key Features Delivered</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-purple-700 mb-2">Clinical Workflow</h4>
              <ul className="space-y-1 text-purple-600">
                <li>• Sleep study management</li>
                <li>• AHI tracking & analytics</li>
                <li>• Treatment outcome monitoring</li>
                <li>• SOAP note templates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-purple-700 mb-2">Device Management</h4>
              <ul className="space-y-1 text-purple-600">
                <li>• Oral appliance ordering</li>
                <li>• DME inventory tracking</li>
                <li>• Insurance authorization</li>
                <li>• Delivery scheduling</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-purple-700 mb-2">Patient Experience</h4>
              <ul className="space-y-1 text-purple-600">
                <li>• Compliance monitoring</li>
                <li>• Progress tracking</li>
                <li>• Educational resources</li>
                <li>• Appointment scheduling</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};