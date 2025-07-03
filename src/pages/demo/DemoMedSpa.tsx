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
  Sparkles,
  Star,
  Camera,
  Heart,
  CheckCircle,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { MedSpaDashboard } from '@/components/specialty/dashboards/MedSpaDashboard';

export const DemoMedSpa = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: "Treatment Revenue Tracking",
      description: "Monitor aesthetic service profitability",
      highlight: "revenue",
      duration: 3000
    },
    {
      title: "Client Satisfaction Metrics",
      description: "Track aesthetic treatment outcomes",
      highlight: "satisfaction", 
      duration: 3000
    },
    {
      title: "Consultation Conversion",
      description: "Optimize consultation to treatment rates",
      highlight: "conversion",
      duration: 3000
    },
    {
      title: "Treatment Protocols",
      description: "AI-guided aesthetic procedures",
      highlight: "protocols",
      duration: 3000
    }
  ];

  const roiMetrics = {
    revenuePerClient: { increase: 35, amount: 2800 },
    consultationConversion: { improvement: 28, rate: 78 },
    clientRetention: { improvement: 42, rate: 89 },
    treatmentEfficiency: { improvement: 25, metric: "minutes saved" }
  };

  const treatmentPackages = [
    { name: "Botox + Filler Combo", price: 1200, popularity: 92 },
    { name: "Laser Facial Series", price: 800, popularity: 78 },
    { name: "CoolSculpting Package", price: 2500, popularity: 65 },
    { name: "Chemical Peel Series", price: 600, popularity: 84 }
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Demo Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">FlowIQ for Medical Spas</h1>
              <p className="text-lg text-gray-600 mt-2">Interactive Demo - Elevate Your Aesthetic Practice</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-pink-100 text-pink-800 px-4 py-2">
                <Eye className="w-4 h-4 mr-2" />
                Live Demo
              </Badge>
              <div className="flex items-center gap-2">
                {!isPlaying ? (
                  <Button onClick={startDemo} className="bg-pink-600 hover:bg-pink-700">
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
                <CardDescription>Explore aesthetic practice features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demoSteps.map((step, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border transition-all duration-300 ${
                        currentStep === index 
                          ? 'border-pink-300 bg-pink-50' 
                          : currentStep > index
                          ? 'border-pink-200 bg-gray-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          currentStep > index 
                            ? 'bg-pink-600 text-white'
                            : currentStep === index
                            ? 'bg-pink-200 text-pink-800'
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
                  <Target className="w-5 h-5 text-pink-600" />
                  ROI Calculator
                </CardTitle>
                <CardDescription>Expected benefits for med spas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Revenue Per Client</span>
                    <Badge className="bg-green-100 text-green-800">+{roiMetrics.revenuePerClient.increase}%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Consultation Conversion</span>
                    <Badge className="bg-blue-100 text-blue-800">{roiMetrics.consultationConversion.rate}%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Client Retention</span>
                    <Badge className="bg-purple-100 text-purple-800">{roiMetrics.clientRetention.rate}%</Badge>
                  </div>
                  <div className="border-t pt-3">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Avg Revenue Per Client</p>
                      <p className="text-2xl font-bold text-pink-600">${roiMetrics.revenuePerClient.amount}</p>
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
                  <Card className="border-pink-300 bg-pink-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                        <div>
                          <p className="font-medium text-pink-800">{demoSteps[currentStep]?.title}</p>
                          <p className="text-sm text-pink-600">{demoSteps[currentStep]?.description}</p>
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
                <MedSpaDashboard />
              </div>
            </div>
          </div>
        </div>

        {/* Client Journey Simulator */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-600" />
              Aesthetic Client Journey
            </CardTitle>
            <CardDescription>Experience a complete med spa treatment workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-pink-50 rounded-lg">
                <h3 className="font-semibold text-pink-800 mb-2">Initial Consultation</h3>
                <p className="text-sm text-pink-600 mb-4">Emma wants to address fine lines</p>
                <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                  Start Consultation
                </Button>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Treatment Planning</h3>
                <p className="text-sm text-purple-600 mb-4">Botox + dermal filler package</p>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Create Plan
                </Button>
              </div>
              
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Treatment Session</h3>
                <p className="text-sm text-blue-600 mb-4">30-minute aesthetic procedure</p>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Begin Treatment
                </Button>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Follow-up Care</h3>
                <p className="text-sm text-green-600 mb-4">Progress photos and touch-ups</p>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Schedule Follow-up
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Treatment Package Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-pink-600" />
                Popular Treatment Packages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {treatmentPackages.map((treatment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-pink-100 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{treatment.name}</p>
                      <p className="text-xs text-gray-600">${treatment.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-pink-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${treatment.popularity}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-pink-700 w-8">{treatment.popularity}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-600" />
                AI Photo Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">Before/after photo tracking with AI analysis</p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
                      <Camera className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-800">Treatment Progress</p>
                      <p className="text-xs text-blue-600">AI detects 85% improvement</p>
                    </div>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  View AI Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Elevate Your Med Spa to New Heights</h2>
              <p className="text-lg text-pink-100 mb-6">
                Join 150+ medical spas using FlowIQ to increase client satisfaction and revenue per treatment
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
                  Book Med Spa Demo
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pink-600">
                  View Success Stories
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};