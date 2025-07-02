import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart,
  Star,
  TrendingUp,
  Users,
  Target,
  Award,
  MessageSquare,
  Calendar,
  BookOpen,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Gift,
  Trophy
} from 'lucide-react';

interface EngagementMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  unit: string;
}

interface PatientProgram {
  id: string;
  name: string;
  description: string;
  participants: number;
  completion_rate: number;
  satisfaction_score: number;
  status: 'active' | 'paused' | 'completed';
  category: string;
}

interface Milestone {
  id: string;
  patient_name: string;
  achievement: string;
  date: string;
  points: number;
  badge: string;
  category: string;
}

export const PatientEngagementHub: React.FC = () => {
  const [activeView, setActiveView] = useState<'overview' | 'programs' | 'gamification' | 'insights'>('overview');

  const engagementMetrics: EngagementMetric[] = [
    {
      id: '1',
      name: 'Portal Usage',
      value: 78,
      target: 85,
      trend: 'up',
      change: 12,
      unit: '%'
    },
    {
      id: '2',
      name: 'Appointment Adherence',
      value: 92,
      target: 90,
      trend: 'up',
      change: 5,
      unit: '%'
    },
    {
      id: '3',
      name: 'Satisfaction Score',
      value: 4.7,
      target: 4.5,
      trend: 'up',
      change: 0.3,
      unit: '/5'
    },
    {
      id: '4',
      name: 'Response Rate',
      value: 84,
      target: 80,
      trend: 'stable',
      change: 0,
      unit: '%'
    },
    {
      id: '5',
      name: 'Care Plan Compliance',
      value: 76,
      target: 85,
      trend: 'down',
      change: -3,
      unit: '%'
    }
  ];

  const programs: PatientProgram[] = [
    {
      id: '1',
      name: 'Healthy Habits Challenge',
      description: '30-day wellness program focusing on daily activities',
      participants: 234,
      completion_rate: 78,
      satisfaction_score: 4.6,
      status: 'active',
      category: 'wellness'
    },
    {
      id: '2',
      name: 'Medication Adherence Program',
      description: 'Support program for chronic care patients',
      participants: 156,
      completion_rate: 89,
      satisfaction_score: 4.8,
      status: 'active',
      category: 'treatment'
    },
    {
      id: '3',
      name: 'Pre-Surgery Preparation',
      description: 'Comprehensive preparation program for surgical patients',
      participants: 67,
      completion_rate: 95,
      satisfaction_score: 4.9,
      status: 'active',
      category: 'surgery'
    },
    {
      id: '4',
      name: 'Mental Health Check-ins',
      description: 'Weekly mental health and wellness assessments',
      participants: 189,
      completion_rate: 72,
      satisfaction_score: 4.4,
      status: 'active',
      category: 'mental-health'
    }
  ];

  const recentMilestones: Milestone[] = [
    {
      id: '1',
      patient_name: 'Sarah Johnson',
      achievement: 'Completed 30-day fitness challenge',
      date: '2024-01-20',
      points: 500,
      badge: 'Fitness Champion',
      category: 'wellness'
    },
    {
      id: '2',
      patient_name: 'Michael Chen',
      achievement: '100% medication adherence for 3 months',
      date: '2024-01-19',
      points: 750,
      badge: 'Consistency Master',
      category: 'treatment'
    },
    {
      id: '3',
      patient_name: 'Emily Davis',
      achievement: 'Completed all pre-surgery requirements',
      date: '2024-01-18',
      points: 300,
      badge: 'Surgery Ready',
      category: 'surgery'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'wellness': return Heart;
      case 'treatment': return Activity;
      case 'surgery': return Target;
      case 'mental-health': return BookOpen;
      default: return Star;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Heart className="h-8 w-8 text-pink-600" />
        <div>
          <h2 className="text-2xl font-bold">Patient Engagement Hub</h2>
          <p className="text-muted-foreground">Drive patient participation and improve health outcomes</p>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="programs" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Programs
          </TabsTrigger>
          <TabsTrigger value="gamification" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Gamification
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {engagementMetrics.map((metric) => (
              <Card key={metric.id}>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{metric.name}</span>
                      {getTrendIcon(metric.trend)}
                    </div>
                    
                    <div className="text-2xl font-bold">
                      {metric.value}{metric.unit}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Target: {metric.target}{metric.unit}
                      </span>
                      <span className={getTrendColor(metric.trend)}>
                        {metric.change > 0 ? '+' : ''}{metric.change}{metric.unit === '/5' ? '' : '%'}
                      </span>
                    </div>
                    
                    <Progress 
                      value={(metric.value / metric.target) * 100} 
                      className="h-2" 
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Engagement Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Active Program Participants</span>
                    <span className="text-2xl font-bold text-blue-600">646</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Monthly Portal Logins</span>
                    <span className="text-2xl font-bold text-green-600">2,341</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Completed Assessments</span>
                    <span className="text-2xl font-bold text-purple-600">1,789</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Patient Messages Sent</span>
                    <span className="text-2xl font-bold text-orange-600">4,567</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMilestones.slice(0, 3).map((milestone) => {
                    const CategoryIcon = getCategoryIcon(milestone.category);
                    
                    return (
                      <div key={milestone.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <CategoryIcon className="h-8 w-8 text-yellow-600 bg-yellow-100 rounded-full p-1" />
                        <div className="flex-1">
                          <div className="font-medium">{milestone.patient_name}</div>
                          <div className="text-sm text-muted-foreground">{milestone.achievement}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {milestone.badge}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              +{milestone.points} points
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {milestone.date}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="programs" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Patient Programs</h3>
            <Button>
              <Target className="h-4 w-4 mr-2" />
              Create Program
            </Button>
          </div>

          <div className="grid gap-6">
            {programs.map((program) => {
              const CategoryIcon = getCategoryIcon(program.category);
              
              return (
                <Card key={program.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <CategoryIcon className="h-6 w-6 text-primary" />
                          <div>
                            <h3 className="font-semibold text-lg">{program.name}</h3>
                            <p className="text-muted-foreground">{program.description}</p>
                          </div>
                          <Badge className={getStatusColor(program.status)}>
                            {program.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">Participants</div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-blue-600" />
                              <span className="text-lg font-semibold">{program.participants}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">Completion Rate</div>
                            <div className="flex items-center gap-2">
                              <Progress value={program.completion_rate} className="flex-1" />
                              <span className="text-lg font-semibold">{program.completion_rate}%</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">Satisfaction</div>
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-yellow-600 fill-current" />
                              <span className="text-lg font-semibold">{program.satisfaction_score}/5</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Communicate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="gamification" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Leaderboard
                </CardTitle>
                <CardDescription>
                  Top performers this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMilestones.map((milestone, index) => (
                    <div key={milestone.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                        ${index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'}`}>
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-medium">{milestone.patient_name}</div>
                        <div className="text-sm text-muted-foreground">{milestone.points} points</div>
                      </div>
                      
                      <Badge variant="outline">{milestone.badge}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Rewards System
                </CardTitle>
                <CardDescription>
                  Available rewards and incentives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Gift className="h-8 w-8 text-purple-600 bg-purple-100 rounded-full p-1" />
                      <div>
                        <div className="font-medium">Health Tracker Device</div>
                        <div className="text-sm text-muted-foreground">1,000 points</div>
                      </div>
                    </div>
                    <Badge variant="secondary">23 claimed</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Gift className="h-8 w-8 text-green-600 bg-green-100 rounded-full p-1" />
                      <div>
                        <div className="font-medium">Wellness Consultation</div>
                        <div className="text-sm text-muted-foreground">750 points</div>
                      </div>
                    </div>
                    <Badge variant="secondary">45 claimed</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Gift className="h-8 w-8 text-blue-600 bg-blue-100 rounded-full p-1" />
                      <div>
                        <div className="font-medium">Pharmacy Discount</div>
                        <div className="text-sm text-muted-foreground">500 points</div>
                      </div>
                    </div>
                    <Badge variant="secondary">156 claimed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Portal engagement increased</span>
                    <span className="text-green-600 font-medium">+23% this month</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Program completion rates</span>
                    <span className="text-green-600 font-medium">+15% improvement</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Patient satisfaction scores</span>
                    <span className="text-green-600 font-medium">+0.3 point increase</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>No-show appointments</span>
                    <span className="text-green-600 font-medium">-18% reduction</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 border rounded-lg bg-blue-50">
                    <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-900">Expand Wellness Programs</div>
                      <div className="text-sm text-blue-700">High completion rates suggest strong patient interest</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border rounded-lg bg-green-50">
                    <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-900">Gamify Medication Adherence</div>
                      <div className="text-sm text-green-700">Apply rewards system to medication compliance</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border rounded-lg bg-purple-50">
                    <Zap className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-purple-900">Personalized Content</div>
                      <div className="text-sm text-purple-700">Tailor programs based on patient preferences</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};