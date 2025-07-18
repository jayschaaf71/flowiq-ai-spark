import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Stethoscope, 
  Smile, 
  Sparkles, 
  Brain,
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  Star,
  ArrowRight,
  Play,
  Target,
  CheckCircle
} from 'lucide-react';

export const DemoHub = () => {
  const navigate = useNavigate();

  const specialtyDemos = [
    {
      title: "Chiropractic Practice",
      description: "See how FlowIQ optimizes care plans, tracks patient outcomes, and automates SOAP notes for chiropractic practices.",
      icon: Stethoscope,
      color: "green",
      path: "/demo/chiropractic",
      metrics: {
        roi: "18% revenue increase",
        efficiency: "15 hrs/week saved",
        satisfaction: "23% improvement"
      },
      features: ["Care Plan Adherence", "Pain Score Tracking", "Visit Optimization", "AI Documentation"]
    },
    {
      title: "Dental Practice",
      description: "Discover dental-specific features including chair optimization, case acceptance tracking, and hygiene recall automation.",
      icon: Smile,
      color: "blue",
      path: "/demo/dental",
      metrics: {
        roi: "22% production increase",
        efficiency: "18 hrs/week saved", 
        satisfaction: "95% collection ratio"
      },
      features: ["Production/Chair Hour", "Case Acceptance", "Hygiene Recalls", "AI Charting"]
    },
    {
      title: "Medical Spa",
      description: "Explore aesthetic practice management with treatment tracking, client satisfaction metrics, and photo documentation.",
      icon: Sparkles,
      color: "pink",
      path: "/demo/medspa",
      metrics: {
        roi: "35% revenue per client",
        efficiency: "78% consultation conversion",
        satisfaction: "89% client retention"
      },
      features: ["Treatment Packages", "Client Satisfaction", "Photo Analysis", "Consultation Conversion"]
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      green: {
        bg: "bg-green-50",
        border: "border-green-200",
        icon: "text-green-600",
        button: "bg-green-600 hover:bg-green-700",
        badge: "bg-green-100 text-green-800"
      },
      blue: {
        bg: "bg-blue-50", 
        border: "border-blue-200",
        icon: "text-blue-600",
        button: "bg-blue-600 hover:bg-blue-700",
        badge: "bg-blue-100 text-blue-800"
      },
      pink: {
        bg: "bg-pink-50",
        border: "border-pink-200", 
        icon: "text-pink-600",
        button: "bg-pink-600 hover:bg-pink-700",
        badge: "bg-pink-100 text-pink-800"
      }
    };
    return colorMap[color] || colorMap.green;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              FlowIQ Interactive Demos
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Experience how FlowIQ transforms healthcare practices with industry-specific AI agents and workflows. 
              Choose your specialty to see tailored solutions in action.
            </p>
            <div className="flex justify-center gap-4">
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm">
                <Play className="w-4 h-4 mr-2" />
                Interactive Demos
              </Badge>
              <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm">
                <Target className="w-4 h-4 mr-2" />
                Real ROI Data
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 px-4 py-2 text-sm">
                <Brain className="w-4 h-4 mr-2" />
                AI-Powered
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Specialty Demo Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {specialtyDemos.map((demo) => {
            const colors = getColorClasses(demo.color);
            const IconComponent = demo.icon;
            
            return (
              <Card key={demo.title} className={`${colors.border} hover:shadow-xl transition-all duration-300 cursor-pointer group`}>
                <CardHeader className={colors.bg}>
                  <div className="flex items-center justify-between mb-4">
                    <IconComponent className={`w-8 h-8 ${colors.icon}`} />
                    <Badge className={colors.badge}>
                      Interactive Demo
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {demo.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {demo.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-6">
                  {/* ROI Metrics */}
                  <div className="grid grid-cols-1 gap-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">ROI Impact</span>
                      <Badge variant="outline" className={colors.badge}>
                        {demo.metrics.roi}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Time Saved</span>
                      <Badge variant="outline" className={colors.badge}>
                        {demo.metrics.efficiency}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Key Metric</span>
                      <Badge variant="outline" className={colors.badge}>
                        {demo.metrics.satisfaction}
                      </Badge>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {demo.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className={`w-full ${colors.button} group-hover:scale-105 transition-transform`}
                    onClick={() => navigate(demo.path)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start {demo.title} Demo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Universal Benefits Section */}
        <Card className="mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
              Universal FlowIQ Benefits
            </CardTitle>
            <CardDescription className="text-lg">
              Core advantages that apply across all healthcare specialties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Automation</h3>
                <p className="text-sm text-gray-600">15+ specialized AI agents working 24/7</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Revenue Optimization</h3>
                <p className="text-sm text-gray-600">Average 18-35% revenue increase</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Time Savings</h3>
                <p className="text-sm text-gray-600">15-20 hours saved per week</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Patient Satisfaction</h3>
                <p className="text-sm text-gray-600">20-40% improvement in outcomes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="gradient-primary text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to See FlowIQ in Your Practice?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Choose a demo above to explore how FlowIQ transforms practices like yours, or book a personalized demonstration with our team.
              </p>
              <div className="flex justify-center gap-6">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-100 px-8 shadow-lg"
                  onClick={() => window.open('https://calendly.com/flowiq-demo', '_blank')}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Book Personal Demo
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-primary px-8"
                  onClick={() => navigate('/roi-calculator')}
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  Calculate ROI
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};