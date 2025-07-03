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
  Smile,
  Calendar,
  FileText,
  CheckCircle,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { DentalDashboard } from '@/components/specialty/dashboards/DentalDashboard';

export const DemoDental = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: "Production Per Chair Hour",
      description: "Optimize scheduling and treatment efficiency",
      highlight: "production",
      duration: 3000
    },
    {
      title: "Case Acceptance Tracking",
      description: "Monitor treatment plan acceptance rates",
      highlight: "acceptance", 
      duration: 3000
    },
    {
      title: "Hygiene Recall Management",
      description: "Automated patient recall scheduling",
      highlight: "recall",
      duration: 3000
    },
    {
      title: "Treatment Documentation",
      description: "AI-powered dental charting and notes",
      highlight: "documentation",
      duration: 3000
    }
  ];

  const roiMetrics = {
    productionIncrease: { percentage: 22, amount: 180000 },
    collectionImprovement: { percentage: 15, amount: 95000 },
    timesSaved: { weekly: 18, monthly: 72 },
    recallEfficiency: { improvement: 40, metric: "recall rate" }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Demo Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">FlowIQ for Dental Practices</h1>
              <p className="text-lg text-gray-600 mt-2">Interactive Demo - Optimize Your Dental Operations</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
                <Eye className="w-4 h-4 mr-2" />
                Live Demo
              </Badge>
              <div className="flex items-center gap-2">
                {!isPlaying ? (
                  <Button onClick={startDemo} className="bg-blue-600 hover:bg-blue-700">
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
                <CardDescription>Explore dental-specific features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demoSteps.map((step, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border transition-all duration-300 ${
                        currentStep === index 
                          ? 'border-blue-300 bg-blue-50' 
                          : currentStep > index
                          ? 'border-blue-200 bg-gray-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          currentStep > index 
                            ? 'bg-blue-600 text-white'
                            : currentStep === index
                            ? 'bg-blue-200 text-blue-800'
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
                  <Target className="w-5 h-5 text-blue-600" />
                  ROI Calculator
                </CardTitle>
                <CardDescription>Expected benefits for dental practices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Production Increase</span>
                    <Badge className="bg-green-100 text-green-800">+{roiMetrics.productionIncrease.percentage}%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Collection Improvement</span>
                    <Badge className="bg-blue-100 text-blue-800">+{roiMetrics.collectionImprovement.percentage}%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Time Saved Weekly</span>
                    <Badge className="bg-purple-100 text-purple-800">{roiMetrics.timesSaved.weekly} hrs</Badge>
                  </div>
                  <div className="border-t pt-3">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Annual Revenue Impact</p>
                      <p className="text-2xl font-bold text-blue-600">${roiMetrics.productionIncrease.amount.toLocaleString()}</p>
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
                  <Card className="border-blue-300 bg-blue-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <div>
                          <p className="font-medium text-blue-800">{demoSteps[currentStep]?.title}</p>
                          <p className="text-sm text-blue-600">{demoSteps[currentStep]?.description}</p>
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
                <DentalDashboard />
              </div>
            </div>
          </div>
        </div>

        {/* Patient Persona Simulator */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="w-5 h-5 text-blue-600" />
              Dental Patient Journey
            </CardTitle>
            <CardDescription>Experience a complete dental treatment workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">New Patient Exam</h3>
                <p className="text-sm text-blue-600 mb-4">Sarah needs a comprehensive dental exam</p>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Start Exam
                </Button>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Treatment Planning</h3>
                <p className="text-sm text-green-600 mb-4">Crown and filling treatment plan</p>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Create Plan
                </Button>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Insurance Pre-Auth</h3>
                <p className="text-sm text-purple-600 mb-4">Automatic insurance verification</p>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Verify Coverage
                </Button>
              </div>
              
              <div className="text-center p-6 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">Follow-up Care</h3>
                <p className="text-sm text-orange-600 mb-4">Automated recall scheduling</p>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                  Schedule Recall
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dental-Specific Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                AI Dental Charting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">Voice-activated dental charting with AI assistance</p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Demo: "Tooth 14, MOD amalgam restoration needed"</p>
                  <p className="text-xs text-blue-600 mt-1">AI automatically updates chart and suggests treatment codes</p>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Try AI Charting
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Smart Scheduling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">Optimize chair utilization and treatment sequencing</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Chair 1 Utilization</span>
                    <Badge className="bg-green-100 text-green-800">92%</Badge>
                  </div>
                  <Progress value={92} className="h-2" />
                  <div className="flex justify-between items-center text-sm">
                    <span>Chair 2 Utilization</span>
                    <Badge className="bg-yellow-100 text-yellow-800">78%</Badge>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Optimize Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Transform Your Dental Practice Today</h2>
              <p className="text-lg text-blue-100 mb-6">
                Join 300+ dental practices using FlowIQ to increase production and streamline operations
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Book Dental Demo
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Download Case Study
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};