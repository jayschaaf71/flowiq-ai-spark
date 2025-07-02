import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, TrendingUp, Heart } from "lucide-react";

export const PatientEngagement = () => {
  const engagementData = [
    { patient: "Sarah Johnson", engagement: 95, lastActive: "2 hours ago", messagesRead: 12, complianceImprovement: "+15%" },
    { patient: "Mike Chen", engagement: 67, lastActive: "1 day ago", messagesRead: 8, complianceImprovement: "+8%" },
    { patient: "Lisa Williams", engagement: 89, lastActive: "30 min ago", messagesRead: 15, complianceImprovement: "+22%" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Patient Engagement Analytics
          </CardTitle>
          <CardDescription>
            Track patient interaction with educational content and compliance nudges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {engagementData.map((patient, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{patient.patient}</h3>
                    <p className="text-sm text-gray-600">Last active: {patient.lastActive}</p>
                  </div>
                  <Badge className={patient.engagement >= 80 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                    {patient.engagement}% Engaged
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Engagement Score</span>
                    <span>{patient.engagement}%</span>
                  </div>
                  <Progress value={patient.engagement} />
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                  <div>
                    <MessageSquare className="w-4 h-4 inline mr-1" />
                    {patient.messagesRead} messages read
                  </div>
                  <div>
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    {patient.complianceImprovement} compliance
                  </div>
                  <div>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};