
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, MessageSquare, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PatientExperienceWidget = () => {
  const navigate = useNavigate();

  const experienceMetrics = [
    { label: "Satisfaction Score", value: "4.8/5", icon: Star },
    { label: "Response Time", value: "2.3 min", icon: MessageSquare },
    { label: "Portal Usage", value: "89%", icon: Heart },
    { label: "No-Shows", value: "3.2%", icon: Phone }
  ];

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200" onClick={() => navigate('/patient-experience')}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-600" />
          Patient Experience
        </CardTitle>
        <CardDescription>Patient satisfaction and engagement metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {experienceMetrics.map((metric, index) => (
            <div key={index} className="flex items-center gap-2">
              <metric.icon className="w-4 h-4 text-pink-600" />
              <div>
                <div className="text-sm font-medium">{metric.value}</div>
                <div className="text-xs text-gray-600">{metric.label}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              Excellent Ratings
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              High Engagement
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
