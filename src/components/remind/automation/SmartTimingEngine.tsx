
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Clock, TrendingUp, Users, Calendar, Zap } from "lucide-react";

interface OptimalTimeSlot {
  time: string;
  patientSegment: string;
  successRate: number;
  responseTime: string;
  volume: number;
}

interface TimingRecommendation {
  appointmentType: string;
  patientAge: string;
  recommendedTime: string;
  reasoning: string;
  confidence: number;
}

export const SmartTimingEngine = () => {
  const [isLearningMode, setIsLearningMode] = useState(true);
  
  const optimalTimes: OptimalTimeSlot[] = [
    {
      time: "9:00 AM",
      patientSegment: "Seniors (65+)",
      successRate: 94,
      responseTime: "12 mins",
      volume: 23
    },
    {
      time: "2:00 PM", 
      patientSegment: "Parents (25-45)",
      successRate: 87,
      responseTime: "8 mins",
      volume: 31
    },
    {
      time: "6:00 PM",
      patientSegment: "Working Adults (25-55)",
      successRate: 82,
      responseTime: "15 mins", 
      volume: 45
    },
    {
      time: "10:00 AM",
      patientSegment: "General Population",
      successRate: 89,
      responseTime: "10 mins",
      volume: 28
    }
  ];

  const recommendations: TimingRecommendation[] = [
    {
      appointmentType: "Routine Checkup",
      patientAge: "Senior (72)",
      recommendedTime: "9:30 AM",
      reasoning: "Seniors respond 35% better to morning communications",
      confidence: 91
    },
    {
      appointmentType: "Urgent Consultation", 
      patientAge: "Adult (34)",
      recommendedTime: "6:15 PM",
      reasoning: "Working adults check messages after work hours",
      confidence: 86
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Smart Timing Engine
          </h3>
          <p className="text-sm text-gray-600">
            AI-powered optimal timing analysis for maximum patient engagement
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Switch 
            checked={isLearningMode} 
            onCheckedChange={setIsLearningMode}
            id="learning-mode"
          />
          <label htmlFor="learning-mode" className="text-sm font-medium">
            Learning Mode
          </label>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Optimal Time Slots by Patient Segment
          </CardTitle>
          <CardDescription>
            AI-identified peak engagement times for different patient demographics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {optimalTimes.map((slot, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-lg font-semibold text-blue-600">
                    {slot.time}
                  </div>
                  <div>
                    <p className="font-medium">{slot.patientSegment}</p>
                    <p className="text-sm text-gray-600">
                      Avg response: {slot.responseTime} • Volume: {slot.volume} messages
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {slot.successRate}%
                    </div>
                    <div className="text-xs text-gray-500">Success Rate</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Current Recommendations
          </CardTitle>
          <CardDescription>
            Personalized timing suggestions for upcoming appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{rec.appointmentType}</p>
                    <p className="text-sm text-gray-600">{rec.patientAge}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    {rec.confidence}% confidence
                  </Badge>
                </div>
                
                <div className="bg-green-50 p-3 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800">
                      Recommended: {rec.recommendedTime}
                    </span>
                  </div>
                  <p className="text-sm text-green-700">{rec.reasoning}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    Apply Recommendation
                  </Button>
                  <Button size="sm" variant="outline">
                    Customize
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {isLearningMode && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Learning Mode Active</p>
                <p className="text-sm text-yellow-700">
                  AI is continuously learning from patient responses to improve timing recommendations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
