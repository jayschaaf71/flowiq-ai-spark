
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { SmartTimingEngine } from "./SmartTimingEngine";
import { 
  Clock, 
  TrendingUp, 
  Target, 
  Calendar,
  BarChart3,
  Zap
} from "lucide-react";

interface OptimalTime {
  hour: number;
  successRate: number;
  patientType: string;
}

export const SmartScheduler = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const optimalTimes: OptimalTime[] = [
    { hour: 9, successRate: 85, patientType: "General" },
    { hour: 14, successRate: 92, patientType: "Seniors" },
    { hour: 18, successRate: 78, patientType: "Working Adults" },
    { hour: 10, successRate: 88, patientType: "Parents" }
  ];

  const scheduleOptimization = async () => {
    setLoading(true);
    try {
      // Simulate AI optimization
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Schedule Optimized",
        description: "AI has optimized reminder timing for better engagement",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to optimize schedule",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Smart Scheduler
          </h3>
          <p className="text-sm text-gray-600">
            AI-powered optimal timing for maximum engagement
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Switch 
            checked={isEnabled} 
            onCheckedChange={setIsEnabled}
            id="smart-scheduler-enabled"
          />
          <label htmlFor="smart-scheduler-enabled" className="text-sm font-medium">
            {isEnabled ? 'Enabled' : 'Disabled'}
          </label>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">+23%</p>
                <p className="text-sm text-gray-600">Response Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">89%</p>
                <p className="text-sm text-gray-600">Engagement Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-gray-600">Optimized Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Smart Timing Engine Component */}
      <SmartTimingEngine />

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Actions</CardTitle>
          <CardDescription>
            Run AI optimization to improve reminder timing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={scheduleOptimization}
              disabled={loading || !isEnabled}
              className="flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {loading ? "Optimizing..." : "Optimize Schedule"}
            </Button>
            <Button variant="outline" disabled={!isEnabled}>
              <Calendar className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
