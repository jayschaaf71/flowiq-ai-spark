
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Calendar, 
  FileText, 
  CreditCard,
  MessageSquare,
  Bell,
  Heart,
  Shield,
  Clock,
  Download,
  Upload,
  Star,
  CheckCircle
} from 'lucide-react';

interface PatientMetrics {
  totalAppointments: number;
  upcomingAppointments: number;
  completedForms: number;
  pendingActions: number;
  healthScore: number;
  satisfactionRating: number;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export const PatientPortalDashboard: React.FC = () => {
  const [metrics] = useState<PatientMetrics>({
    totalAppointments: 12,
    upcomingAppointments: 2,
    completedForms: 8,
    pendingActions: 3,
    healthScore: 87,
    satisfactionRating: 4.8
  });

  const [quickActions] = useState<QuickAction[]>([
    {
      id: '1',
      title: 'Complete Health Assessment',
      description: 'Annual health questionnaire due',
      icon: Heart,
      action: 'complete_assessment',
      priority: 'high',
      completed: false
    },
    {
      id: '2',
      title: 'Update Insurance Information',
      description: 'Verify current insurance details',
      icon: Shield,
      action: 'update_insurance',
      priority: 'medium',
      completed: false
    },
    {
      id: '3',
      title: 'Schedule Follow-up',
      description: 'Book your next appointment',
      icon: Calendar,
      action: 'schedule_followup',
      priority: 'medium',
      completed: false
    },
    {
      id: '4',
      title: 'Download Lab Results',
      description: 'Recent test results available',
      icon: Download,
      action: 'download_results',
      priority: 'low',
      completed: true
    }
  ]);

  const recentActivity = [
    { date: '2024-01-15', activity: 'Appointment completed with Dr. Smith', type: 'appointment' },
    { date: '2024-01-12', activity: 'Lab results uploaded', type: 'results' },
    { date: '2024-01-10', activity: 'Prescription refill requested', type: 'prescription' },
    { date: '2024-01-08', activity: 'Insurance claim processed', type: 'billing' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <User className="h-8 w-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold">Patient Portal Dashboard</h2>
          <p className="text-gray-600">Manage your healthcare journey in one place</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.totalAppointments}</div>
              <div className="text-sm text-gray-600">Total Visits</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.upcomingAppointments}</div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{metrics.completedForms}</div>
              <div className="text-sm text-gray-600">Forms Done</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{metrics.pendingActions}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{metrics.healthScore}%</div>
              <div className="text-sm text-gray-600">Health Score</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <span className="text-2xl font-bold text-yellow-600">{metrics.satisfactionRating}</span>
                <Star className="h-4 w-4 text-yellow-600 fill-current" />
              </div>
              <div className="text-sm text-gray-600">Satisfaction</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Action Items
          </CardTitle>
          <CardDescription>
            Important tasks and reminders for your healthcare
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              
              return (
                <div 
                  key={action.id} 
                  className={`border rounded-lg p-4 ${getPriorityColor(action.priority)} ${action.completed ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-6 w-6 text-gray-600" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{action.title}</h3>
                          {action.completed && <CheckCircle className="h-4 w-4 text-green-600" />}
                          <Badge variant="outline" className={
                            action.priority === 'high' ? 'border-red-300 text-red-700' :
                            action.priority === 'medium' ? 'border-yellow-300 text-yellow-700' :
                            'border-green-300 text-green-700'
                          }>
                            {action.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                    
                    {!action.completed && (
                      <Button size="sm">
                        Take Action
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Health Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="text-sm">
                    <div className="font-medium">{item.activity}</div>
                    <div className="text-gray-500">{item.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Health Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Health Score</span>
                  <span>{metrics.healthScore}%</span>
                </div>
                <Progress value={metrics.healthScore} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Preventive Care</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Medication Adherence</span>
                  <span>95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Follow-up Compliance</span>
                  <span>78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-3 text-blue-600" />
            <h3 className="font-semibold mb-2">Book Appointment</h3>
            <p className="text-sm text-gray-600">Schedule your next visit</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 mx-auto mb-3 text-green-600" />
            <h3 className="font-semibold mb-2">Medical Records</h3>
            <p className="text-sm text-gray-600">View your health history</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <CreditCard className="h-8 w-8 mx-auto mb-3 text-purple-600" />
            <h3 className="font-semibold mb-2">Billing</h3>
            <p className="text-sm text-gray-600">Manage payments & insurance</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-3 text-orange-600" />
            <h3 className="font-semibold mb-2">Messages</h3>
            <p className="text-sm text-gray-600">Contact your care team</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
