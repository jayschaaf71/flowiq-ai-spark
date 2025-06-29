
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, CheckCircle, AlertTriangle, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ComplianceWidget = () => {
  const navigate = useNavigate();

  const complianceAreas = [
    { label: "HIPAA Compliance", score: 98, status: "excellent" },
    { label: "Security Audit", score: 94, status: "good" },
    { label: "Data Backup", score: 100, status: "excellent" },
    { label: "Access Controls", score: 91, status: "good" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      default: return 'text-yellow-600';
    }
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200" onClick={() => navigate('/compliance')}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Compliance & Security
        </CardTitle>
        <CardDescription>Security posture and compliance status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {complianceAreas.map((area, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{area.label}</span>
                <span className={`font-medium ${getStatusColor(area.status)}`}>
                  {area.score}%
                </span>
              </div>
              <Progress value={area.score} className="h-2" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <CheckCircle className="w-3 h-3 mr-1" />
              Compliant
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              <Lock className="w-3 h-3 mr-1" />
              Secure
            </Badge>
          </div>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
