import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Clock, 
  Send,
  Calendar,
  CheckCircle,
  AlertCircle,
  Users,
  BarChart3,
  Settings,
  Mail,
  MessageSquare,
  Phone,
  Target,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FollowUpTemplate {
  id: string;
  name: string;
  description: string;
  trigger: 'post_appointment' | 'missed_appointment' | 'custom';
  delay_hours: number;
  channel: 'email' | 'sms' | 'both';
  template_content: string;
  is_active: boolean;
  success_rate: number;
  total_sent: number;
}

interface FollowUpCampaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  templates: FollowUpTemplate[];
  target_patients: number;
  completed_patients: number;
  response_rate: number;
  created_at: string;
}

interface PatientJourney {
  id: string;
  patient_name: string;
  appointment_date: string;
  current_stage: string;
  next_followup: string;
  completion_rate: number;
  engagement_score: number;
  last_interaction: string;
  status: 'active' | 'completed' | 'paused';
}

export const FollowUpWorkflows: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'campaigns' | 'templates' | 'journeys' | 'analytics'>('campaigns');

  const [campaigns] = useState<FollowUpCampaign[]>([
    {
      id: '1',
      name: 'Post-Appointment Care Follow-up',
      status: 'active',
      templates: [],
      target_patients: 150,
      completed_patients: 127,
      response_rate: 78,
      created_at: '2024-01-01'
    },
    {
      id: '2', 
      name: 'Missed Appointment Recovery',
      status: 'active',
      templates: [],
      target_patients: 45,
      completed_patients: 32,
      response_rate: 65,
      created_at: '2024-01-10'
    },
    {
      id: '3',
      name: 'Wellness Check-in Series',
      status: 'paused',
      templates: [],
      target_patients: 200,
      completed_patients: 89,
      response_rate: 82,
      created_at: '2023-12-15'
    }
  ]);

  const [templates] = useState<FollowUpTemplate[]>([
    {
      id: '1',
      name: '24h Post-Appointment Check-in',
      description: 'Follow up within 24 hours after appointment',
      trigger: 'post_appointment',
      delay_hours: 24,
      channel: 'email',
      template_content: 'Hi {{patient_name}}, how are you feeling after your appointment with {{provider_name}}?',
      is_active: true,
      success_rate: 85,
      total_sent: 1247
    },
    {
      id: '2',
      name: 'Missed Appointment Recovery',
      description: 'Reach out to patients who missed appointments',
      trigger: 'missed_appointment',
      delay_hours: 2,
      channel: 'both',
      template_content: 'We missed you at your appointment today. Let\'s reschedule at your convenience.',
      is_active: true,
      success_rate: 72,
      total_sent: 234
    },
    {
      id: '3',
      name: 'Weekly Wellness Check',
      description: 'Regular wellness check-ins for chronic care patients',
      trigger: 'custom',
      delay_hours: 168, // 1 week
      channel: 'sms',
      template_content: 'Hi {{patient_name}}, how has your week been? Any concerns about your treatment?',
      is_active: true,
      success_rate: 91,
      total_sent: 567
    }
  ]);

  const [patientJourneys] = useState<PatientJourney[]>([
    {
      id: '1',
      patient_name: 'Sarah Johnson',
      appointment_date: '2024-01-18',
      current_stage: 'Post-appointment follow-up',
      next_followup: '2024-01-25',
      completion_rate: 75,
      engagement_score: 92,
      last_interaction: '2024-01-20',
      status: 'active'
    },
    {
      id: '2',
      patient_name: 'Michael Chen',
      appointment_date: '2024-01-17',
      current_stage: 'Medication adherence check',
      next_followup: '2024-01-24',
      completion_rate: 60,
      engagement_score: 78,
      last_interaction: '2024-01-19',
      status: 'active'
    },
    {
      id: '3',
      patient_name: 'Emily Davis',
      appointment_date: '2024-01-15',
      current_stage: 'Treatment satisfaction survey',
      next_followup: '2024-01-22',
      completion_rate: 100,
      engagement_score: 95,
      last_interaction: '2024-01-21',
      status: 'completed'
    }
  ]);

  const workflowMetrics = {
    total_campaigns: 12,
    active_campaigns: 8,
    avg_response_rate: 76,
    total_patients_engaged: 2341,
    improvement_rate: 23
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return Mail;
      case 'sms': return MessageSquare;
      case 'both': return Phone;
      default: return Send;
    }
  };

  const toggleTemplate = async (templateId: string, isActive: boolean) => {
    toast({
      title: isActive ? "Template Activated" : "Template Deactivated",
      description: `Follow-up template has been ${isActive ? 'activated' : 'deactivated'}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Target className="h-8 w-8 text-emerald-600" />
        <div>
          <h2 className="text-2xl font-bold">Follow-up Workflows</h2>
          <p className="text-muted-foreground">Automated patient engagement and care coordination</p>
        </div>
      </div>

      {/* Workflow Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{workflowMetrics.total_campaigns}</div>
              <div className="text-sm text-muted-foreground">Total Campaigns</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{workflowMetrics.active_campaigns}</div>
              <div className="text-sm text-muted-foreground">Active Now</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{workflowMetrics.avg_response_rate}%</div>
              <div className="text-sm text-muted-foreground">Avg Response</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{workflowMetrics.total_patients_engaged.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Patients Engaged</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-2xl font-bold text-green-600">+{workflowMetrics.improvement_rate}%</span>
              </div>
              <div className="text-sm text-muted-foreground">Improvement</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        {[
          { id: 'campaigns', label: 'Campaigns', icon: Target },
          { id: 'templates', label: 'Templates', icon: Mail },
          { id: 'journeys', label: 'Patient Journeys', icon: Users },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Active Campaigns</h3>
            <Button>
              <Target className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </div>
          
          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{campaign.name}</h3>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Progress</div>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={(campaign.completed_patients / campaign.target_patients) * 100} 
                              className="flex-1" 
                            />
                            <span className="text-sm font-medium">
                              {campaign.completed_patients}/{campaign.target_patients}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-muted-foreground">Response Rate</div>
                          <div className="text-2xl font-bold text-emerald-600">{campaign.response_rate}%</div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-muted-foreground">Created</div>
                          <div className="text-sm">{campaign.created_at}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analytics
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Follow-up Templates</h3>
            <Button>
              <Mail className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
          
          <div className="grid gap-4">
            {templates.map((template) => {
              const ChannelIcon = getChannelIcon(template.channel);
              
              return (
                <Card key={template.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{template.name}</h3>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <ChannelIcon className="h-3 w-3" />
                            {template.channel}
                          </Badge>
                          <Badge variant="secondary">
                            {template.delay_hours}h delay
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                        
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="text-sm font-medium mb-1">Template Preview:</div>
                          <p className="text-sm italic">{template.template_content}</p>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Success Rate: {template.success_rate}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Send className="h-4 w-4 text-blue-600" />
                            <span>Sent: {template.total_sent.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 ml-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={template.is_active}
                            onCheckedChange={(checked) => toggleTemplate(template.id, checked)}
                          />
                          <span className="text-sm">{template.is_active ? 'Active' : 'Inactive'}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Patient Journeys Tab */}
      {activeTab === 'journeys' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Patient Care Journeys</h3>
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              View All Patients
            </Button>
          </div>
          
          <div className="grid gap-4">
            {patientJourneys.map((journey) => (
              <Card key={journey.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{journey.patient_name}</h3>
                        <Badge className={getStatusColor(journey.status)}>
                          {journey.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Current Stage</div>
                          <div className="text-sm font-medium">{journey.current_stage}</div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Next Follow-up</div>
                          <div className="text-sm font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {journey.next_followup}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground mb-2">Journey Progress</div>
                          <div className="flex items-center gap-2">
                            <Progress value={journey.completion_rate} className="flex-1" />
                            <span className="text-sm font-medium">{journey.completion_rate}%</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-muted-foreground mb-2">Engagement Score</div>
                          <div className="flex items-center gap-2">
                            <Progress value={journey.engagement_score} className="flex-1" />
                            <span className="text-sm font-medium">{journey.engagement_score}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Last interaction: {journey.last_interaction}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Workflow Analytics</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Response Rates by Channel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </span>
                    <div className="flex items-center gap-2 flex-1 mx-4">
                      <Progress value={78} className="flex-1" />
                      <span className="text-sm font-medium">78%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      SMS
                    </span>
                    <div className="flex items-center gap-2 flex-1 mx-4">
                      <Progress value={85} className="flex-1" />
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Combined
                    </span>
                    <div className="flex items-center gap-2 flex-1 mx-4">
                      <Progress value={92} className="flex-1" />
                      <span className="text-sm font-medium">92%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Open Rate</span>
                    <span className="font-semibold">89%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Click-through Rate</span>
                    <span className="font-semibold">34%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completion Rate</span>
                    <span className="font-semibold">67%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Patient Satisfaction</span>
                    <span className="font-semibold">4.8/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};