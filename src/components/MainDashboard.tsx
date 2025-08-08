import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useTenantConfig } from '@/utils/enhancedTenantConfig';
import { TenantSwitcher } from '@/components/tenant/TenantSwitcher';
import {
  Stethoscope,
  Brain,
  Users,
  BarChart3,
  Zap,
  ArrowRight,
  Star,
  Activity,
  Calendar,
  DollarSign,
  Shield,
  Bot,
  Sparkles,
  Monitor,
  Phone,
  MessageSquare,
  Clock,
  TrendingUp,
  CheckCircle,
  Settings,
  Building2
} from 'lucide-react';

const MainDashboard = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const tenantConfig = useTenantConfig();
  const [activeTab, setActiveTab] = useState('specialties');

  const specialties = [
    {
      id: 'chiropractic-care',
      name: 'Chiropractic Care',
      description: 'Spine & musculoskeletal treatment',
      icon: Activity,
      color: 'bg-gradient-to-br from-green-500 to-emerald-600',
      path: '/chiropractic/dashboard',
      features: ['Spinal Adjustments', 'Pain Management', 'Physical Therapy', 'Patient Care'],
      patients: '2,400+',
      satisfaction: '98%'
    },
    {
      id: 'dental-sleep-medicine',
      name: 'Dental Sleep Medicine',
      description: 'Sleep apnea & oral appliance therapy',
      icon: Brain,
      color: 'bg-gradient-to-br from-purple-500 to-violet-600',
      path: '/dental-sleep/dashboard',
      features: ['Sleep Studies', 'Oral Appliances', 'DME Tracking', 'Follow-up Care'],
      patients: '1,800+',
      satisfaction: '96%'
    },
    {
      id: 'general-dentistry',
      name: 'General Dentistry',
      description: 'Comprehensive dental care',
      icon: Stethoscope,
      color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      path: '/general-dentistry/dashboard',
      features: ['Preventive Care', 'Restorative', 'Cosmetic', 'Emergency'],
      patients: '3,200+',
      satisfaction: '97%'
    },
    {
      id: 'orthodontics',
      name: 'Orthodontics',
      description: 'Teeth alignment & bite correction',
      icon: Users,
      color: 'bg-gradient-to-br from-orange-500 to-red-600',
      path: '/orthodontics/dashboard',
      features: ['Braces', 'Invisalign', 'Retainers', 'Bite Correction'],
      patients: '1,500+',
      satisfaction: '99%'
    },
    {
      id: 'physical-therapy',
      name: 'Physical Therapy',
      description: 'Movement & rehabilitation therapy',
      icon: Activity,
      color: 'bg-gradient-to-br from-teal-500 to-green-600',
      path: '/physical-therapy/dashboard',
      features: ['Exercise Programs', 'Manual Therapy', 'Injury Recovery', 'Sports Medicine'],
      patients: '2,100+',
      satisfaction: '95%'
    },
    {
      id: 'mental-health',
      name: 'Mental Health',
      description: 'Counseling & psychological services',
      icon: Brain,
      color: 'bg-gradient-to-br from-indigo-500 to-purple-600',
      path: '/mental-health/dashboard',
      features: ['Therapy Sessions', 'Assessment Tools', 'Treatment Plans', 'Progress Tracking'],
      patients: '950+',
      satisfaction: '94%'
    }
  ];

  const aiAgents = [
    { name: 'Communication iQ', icon: Calendar, description: 'Complete patient communication lifecycle', status: 'active' },
    { name: 'Scribe iQ', icon: Stethoscope, description: 'Clinical documentation', status: 'active' },
    { name: 'Marketing iQ', icon: TrendingUp, description: 'Patient acquisition', status: 'active' },
    { name: 'Claims iQ', icon: DollarSign, description: 'Revenue cycle', status: 'active' },
    { name: 'Communication iQ', icon: MessageSquare, description: 'Multi-channel communication', status: 'new' },
    { name: 'Insurance iQ', icon: Shield, description: 'Benefits verification & authorization', status: 'active' },
    { name: 'Analytics iQ', icon: BarChart3, description: 'Business intelligence & reporting', status: 'active' },
    { name: 'Voice iQ', icon: Phone, description: 'AI voice assistants & call automation', status: 'active' },
    { name: 'Workflow iQ', icon: Zap, description: 'Process automation & optimization', status: 'active' },
    { name: 'Compliance iQ', icon: CheckCircle, description: 'Regulatory compliance monitoring', status: 'active' }
  ];

  const quickStats = [
    { label: 'Total Patients', value: '7,400+', icon: Users, trend: '+12%' },
    { label: 'AI Interactions', value: '24.8K', icon: Bot, trend: '+34%' },
    { label: 'Revenue Growth', value: '+28%', icon: TrendingUp, trend: 'This month' },
    { label: 'System Uptime', value: '99.9%', icon: Shield, trend: 'Last 30 days' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header with Tenant Switcher */}
      <div className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Flow IQ Platform</h2>
                <p className="text-sm text-muted-foreground">Multi-Specialty Practice Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TenantSwitcher />
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/platform-admin')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative w-full px-6 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Welcome to <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Flow IQ</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              AI-powered practice management for healthcare professionals. Choose your specialty to access intelligent workflows, automation, and insights.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="bg-white/10 text-white border-white/30 px-4 py-2">
                <Bot className="w-4 h-4 mr-2" />
                AI-Powered
              </Badge>
              <Badge variant="outline" className="bg-white/10 text-white border-white/30 px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                HIPAA Compliant
              </Badge>
              <Badge variant="outline" className="bg-white/10 text-white border-white/30 px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                24/7 Support
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-6 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 bg-white/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-emerald-600 font-medium">{stat.trend}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-white/50 backdrop-blur-sm">
              <TabsTrigger value="specialties">Specialties</TabsTrigger>
              <TabsTrigger value="ai-agents">AI Agents</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="specialties" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Choose Your Specialty</h2>
              <p className="text-lg text-muted-foreground">
                Access specialized workflows designed for your practice
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {specialties.map((specialty) => {
                const Icon = specialty.icon;
                return (
                  <Card
                    key={specialty.id}
                    className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-0 bg-white/80 backdrop-blur-sm overflow-hidden"
                    onClick={() => navigate(specialty.path)}
                  >
                    <div className={`h-24 ${specialty.color} relative`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                      <div className="absolute bottom-4 left-6">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                    </div>

                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {specialty.name}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {specialty.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Patients</p>
                          <p className="font-semibold">{specialty.patients}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Satisfaction</p>
                          <p className="font-semibold text-emerald-600">{specialty.satisfaction}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Key Features:</p>
                        <div className="flex flex-wrap gap-2">
                          {specialty.features.map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Access Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="ai-agents" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">AI-Powered Agents</h2>
              <p className="text-lg text-muted-foreground">
                Intelligent automation for every aspect of your practice
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiAgents.map((agent, index) => {
                const Icon = agent.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mr-4">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <CardDescription>{agent.description}</CardDescription>
                      </div>
                      {agent.status === 'new' && (
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                          New
                        </Badge>
                      )}
                      {agent.status === 'active' && (
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        Configure Agent
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Additional Tools</h2>
              <p className="text-lg text-muted-foreground">
                Extended functionality and specialized applications
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card
                className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 to-purple-50"
                onClick={() => navigate('/communication-iq')}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-fit mb-4">
                    <MessageSquare className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">Communication IQ</CardTitle>
                  <CardDescription>
                    AI-powered communication system for any business
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                      Smart scheduling & booking
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                      Multi-channel communication
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                      Automated follow-ups
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    Launch Communication IQ
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => navigate('/dental-sleep/test')}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full w-fit mb-4">
                    <Monitor className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">System Testing</CardTitle>
                  <CardDescription>
                    Comprehensive application testing suite
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Run Tests
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer opacity-60">
                <CardHeader className="text-center">
                  <div className="mx-auto p-3 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full w-fit mb-4">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">More Tools</CardTitle>
                  <CardDescription>
                    Additional integrations coming soon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" disabled>
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* User Info */}
        {profile && (
          <Card className="mt-12 border-0 bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    Welcome back, {profile.first_name || user?.email?.split('@')[0]}!
                  </h3>
                  <p className="text-muted-foreground">
                    Role: {profile.role} | Current Practice: {tenantConfig?.tenantConfig?.brand_name || 'Flow IQ Platform'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/platform-admin')}
                  >
                    Platform Settings
                  </Button>
                  <Button
                    onClick={() => {
                      const specialty = tenantConfig?.tenantConfig?.specialty || 'chiropractic';
                      navigate(`/${specialty}/dashboard`);
                    }}
                  >
                    Go to Current Practice
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MainDashboard;