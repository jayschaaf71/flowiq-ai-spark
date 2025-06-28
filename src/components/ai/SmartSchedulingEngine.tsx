
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  Brain, 
  Clock, 
  TrendingUp, 
  Users,
  Target,
  Zap,
  Settings
} from 'lucide-react';

interface SchedulingOptimization {
  metric: string;
  current: number;
  optimized: number;
  improvement: number;
}

interface SmartRecommendation {
  id: string;
  type: 'time_slot' | 'provider_match' | 'duration_adjust' | 'buffer_time';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
}

export const SmartSchedulingEngine: React.FC = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationMode, setOptimizationMode] = useState('efficiency');
  
  const optimizations: SchedulingOptimization[] = [
    { metric: 'Schedule Efficiency', current: 73, optimized: 91, improvement: 18 },
    { metric: 'Patient Wait Time', current: 18, optimized: 12, improvement: -6 },
    { metric: 'Provider Utilization', current: 82, optimized: 94, improvement: 12 },
    { metric: 'Same-day Bookings', current: 45, optimized: 68, improvement: 23 }
  ];

  const recommendations: SmartRecommendation[] = [
    {
      id: '1',
      type: 'time_slot',
      title: 'Optimize Morning Slots',
      description: 'Move routine checkups to 9-11 AM window for 23% better efficiency',
      impact: 'high',
      confidence: 94
    },
    {
      id: '2',
      type: 'provider_match',
      title: 'Smart Provider Matching',
      description: 'Match patients to providers based on specialty and previous interactions',
      impact: 'high',
      confidence: 89
    },
    {
      id: '3',
      type: 'duration_adjust',
      title: 'Dynamic Duration Adjustment',
      description: 'Adjust appointment lengths based on appointment type and patient history',
      impact: 'medium',
      confidence: 76
    },
    {
      id: '4',
      type: 'buffer_time',
      title: 'Smart Buffer Management',
      description: 'Reduce buffer times between appointments by 5 minutes on average',
      impact: 'medium',
      confidence: 82
    }
  ];

  const runOptimization = async () => {
    setIsOptimizing(true);
    // Simulate AI optimization process
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsOptimizing(false);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold">Smart Scheduling Engine</h2>
            <p className="text-gray-600">AI-powered appointment optimization and scheduling intelligence</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={optimizationMode} onValueChange={setOptimizationMode}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="efficiency">Efficiency</SelectItem>
              <SelectItem value="patient_satisfaction">Patient Satisfaction</SelectItem>
              <SelectItem value="revenue">Revenue Optimization</SelectItem>
              <SelectItem value="balanced">Balanced</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={runOptimization} disabled={isOptimizing}>
            {isOptimizing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            ) : (
              <Zap className="h-4 w-4 mr-2" />
            )}
            {isOptimizing ? 'Optimizing...' : 'Run Optimization'}
          </Button>
        </div>
      </div>

      {/* Optimization Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Optimization Impact Preview
          </CardTitle>
          <CardDescription>
            Projected improvements with AI-powered scheduling optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {optimizations.map((opt, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{opt.metric}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{opt.current}%</span>
                    <span className="text-sm text-gray-400">→</span>
                    <span className="text-sm font-semibold text-green-600">{opt.optimized}%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Current</span>
                    <span>Optimized</span>
                  </div>
                  <div className="relative">
                    <Progress value={opt.current} className="h-2" />
                    <Progress 
                      value={opt.optimized} 
                      className="h-2 absolute top-0 opacity-50 bg-green-200" 
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    {opt.improvement > 0 ? '+' : ''}{opt.improvement}% improvement
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Smart Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            AI Recommendations
          </CardTitle>
          <CardDescription>
            Intelligent suggestions to optimize your scheduling workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{rec.title}</h3>
                      <Badge className={getImpactColor(rec.impact)}>
                        {rec.impact} impact
                      </Badge>
                      <Badge variant="outline">
                        {rec.confidence}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Confidence Score: {rec.confidence}%
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Learn More
                    </Button>
                    <Button size="sm">
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-6 w-6 text-blue-600" />
              <h3 className="font-semibold">Today's Schedule</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Utilization Rate</span>
                <span className="font-semibold">87%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Appointments</span>
                <span className="font-semibold">24/28</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>No-shows</span>
                <span className="font-semibold text-red-600">2</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-6 w-6 text-green-600" />
              <h3 className="font-semibold">Wait Times</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Average Wait</span>
                <span className="font-semibold">12 min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Current Wait</span>
                <span className="font-semibold">8 min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Max Wait</span>
                <span className="font-semibold">25 min</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-purple-600" />
              <h3 className="font-semibold">Provider Load</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Dr. Smith</span>
                <span className="font-semibold">95%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Dr. Johnson</span>
                <span className="font-semibold">78%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Dr. Williams</span>
                <span className="font-semibold">82%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
