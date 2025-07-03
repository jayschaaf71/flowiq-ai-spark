import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Eye,
  Users, 
  DollarSign,
  Clock,
  Target,
  ArrowUp,
  CheckCircle,
  AlertTriangle,
  Gauge
} from 'lucide-react';
import { ChiropracticDashboard } from '@/components/specialty/dashboards/ChiropracticDashboard';

export const DemoChiropractic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: "Daily Collections Tracking",
      description: "Monitor real-time revenue and collection goals",
      highlight: "collections",
      duration: 3000
    },
    {
      title: "Care Plan Adherence",
      description: "Track patient compliance with treatment protocols",
      highlight: "adherence", 
      duration: 3000
    },
    {
      title: "Pain Score Improvements",
      description: "Measure clinical outcomes automatically",
      highlight: "outcomes",
      duration: 3000
    },
    {
      title: "Workflow Automation",
      description: "AI-powered documentation and scheduling",
      highlight: "automation",
      duration: 3000
    }
  ];

  const roiMetrics = {
    timesSaved: { weekly: 15, monthly: 60 },
    revenuIncrease: { percentage: 18, amount: 45000 },
    patientSatisfaction: { improvement: 23, newScore: 4.7 },
    efficiency: { improvement: 35, metric: "visits/day" }
  };

  const startDemo = () => {
    setIsPlaying(true);
    setCurrentStep(0);
  };

  const pauseDemo = () => {
    setIsPlaying(false);
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Demo Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">FlowIQ for Chiropractic</h1>
              <p className="text-lg text-gray-600 mt-2">Interactive Demo - See Your Practice Transformed</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-green-100 text-green-800 px-4 py-2">
                <Eye className="w-4 h-4 mr-2" />
                Live Demo
              </Badge>
              <div className="flex items-center gap-2">
                {!isPlaying ? (
                  <Button onClick={startDemo} className="bg-green-600 hover:bg-green-700">
                    <Play className="w-4 h-4 mr-2" />
                    Start Demo
                  </Button>
                ) : (
                  <Button onClick={pauseDemo} variant="outline">
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                )}
                <Button onClick={resetDemo} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Demo Progress Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Demo Journey</CardTitle>
                <CardDescription>Follow along as we showcase key features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demoSteps.map((step, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border transition-all duration-300 ${
                        currentStep === index 
                          ? 'border-green-300 bg-green-50' 
                          : currentStep > index
                          ? 'border-green-200 bg-gray-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          currentStep > index 
                            ? 'bg-green-600 text-white'
                            : currentStep === index
                            ? 'bg-green-200 text-green-800'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {currentStep > index ? <CheckCircle className="w-3 h-3" /> : index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{step.title}</p>
                          <p className="text-xs text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ROI Calculator */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  ROI Calculator
                </CardTitle>
                <CardDescription>Estimated benefits for your practice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Time Saved Weekly</span>
                    <Badge className="bg-blue-100 text-blue-800">{roiMetrics.timesSaved.weekly} hrs</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Revenue Increase</span>
                    <Badge className="bg-green-100 text-green-800">+{roiMetrics.revenuIncrease.percentage}%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Patient Satisfaction</span>
                    <Badge className="bg-purple-100 text-purple-800">+{roiMetrics.patientSatisfaction.improvement}%</Badge>
                  </div>
                  <div className="border-t pt-3">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Annual ROI</p>
                      <p className="text-2xl font-bold text-green-600">${roiMetrics.revenuIncrease.amount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Demo Area */}
          <div className="lg:col-span-3">
            <div className="relative">
              {/* Demo Overlay */}
              {isPlaying && (
                <div className="absolute top-4 left-4 z-10">
                  <Card className="border-green-300 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <div>
                          <p className="font-medium text-green-800">{demoSteps[currentStep]?.title}</p>
                          <p className="text-sm text-green-600">{demoSteps[currentStep]?.description}</p>
                        </div>
                      </div>
                      <Progress 
                        value={(currentStep + 1) / demoSteps.length * 100} 
                        className="mt-3 h-2"
                      />
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Actual Dashboard */}
              <div className={`transition-all duration-500 ${isPlaying ? 'opacity-90' : 'opacity-100'}`}>
                <ChiropracticDashboard />
              </div>
            </div>
          </div>
        </div>

        {/* Patient Persona Simulator */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Patient Journey Simulator
            </CardTitle>
            <CardDescription>See how FlowIQ handles a typical chiropractic patient</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">New Patient Intake</h3>
                <p className="text-sm text-blue-600 mb-4">John arrives with lower back pain</p>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Simulate Intake
                </Button>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Treatment Plan</h3>
                <p className="text-sm text-green-600 mb-4">AI suggests 8-visit adjustment series</p>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  View Care Plan
                </Button>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Outcome Tracking</h3>
                <p className="text-sm text-purple-600 mb-4">Pain score reduces from 8 to 2</p>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Track Progress
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Chiropractic Practice?</h2>
              <p className="text-lg text-green-100 mb-6">
                Join 500+ chiropractic practices already using FlowIQ to increase efficiency and patient outcomes
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                  Schedule Live Demo
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  Start Free Trial
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};