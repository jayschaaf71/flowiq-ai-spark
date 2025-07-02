import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell, 
  Settings,
  Send,
  Calendar,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  AlertCircle,
  CheckCircle,
  Filter,
  Search,
  Plus,
  Zap,
  Target,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNotificationQueue } from '@/hooks/useNotificationQueue';

interface NotificationRule {
  id: string;
  name: string;
  description: string;
  trigger: 'appointment_booked' | 'appointment_reminder' | 'appointment_cancelled' | 'custom';
  timing: number; // hours before/after
  channels: ('email' | 'sms' | 'push')[];
  template: string;
  is_active: boolean;
  success_rate: number;
  total_sent: number;
}

interface NotificationMetrics {
  total_sent: number;
  delivery_rate: number;
  open_rate: number;
  response_rate: number;
  avg_response_time: number;
}

export const NotificationCenter: React.FC = () => {
  const { toast } = useToast();
  const { notifications, loading, loadNotifications, scheduleNotification } = useNotificationQueue();
  
  const [activeTab, setActiveTab] = useState<'queue' | 'rules' | 'templates' | 'analytics'>('queue');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [rules] = useState<NotificationRule[]>([
    {
      id: '1',
      name: 'Appointment Reminder - 24h',
      description: 'Send reminder 24 hours before appointment',
      trigger: 'appointment_reminder',
      timing: 24,
      channels: ['email', 'sms'],
      template: 'Don\'t forget your appointment tomorrow at {{time}} with {{provider}}',
      is_active: true,
      success_rate: 94,
      total_sent: 1567
    },
    {
      id: '2',
      name: 'Appointment Reminder - 2h',
      description: 'Final reminder 2 hours before appointment',
      trigger: 'appointment_reminder',
      timing: 2,
      channels: ['sms'],
      template: 'Your appointment with {{provider}} is in 2 hours. See you soon!',
      is_active: true,
      success_rate: 89,
      total_sent: 1432
    },
    {
      id: '3',
      name: 'Appointment Confirmation',
      description: 'Immediate confirmation when appointment is booked',
      trigger: 'appointment_booked',
      timing: 0,
      channels: ['email'],
      template: 'Your appointment has been confirmed for {{date}} at {{time}}',
      is_active: true,
      success_rate: 98,
      total_sent: 2341
    }
  ]);

  const metrics: NotificationMetrics = {
    total_sent: 5340,
    delivery_rate: 97,
    open_rate: 84,
    response_rate: 67,
    avg_response_time: 2.3
  };

  useEffect(() => {
    loadNotifications(filterStatus === 'all' ? undefined : filterStatus);
  }, [filterStatus, loadNotifications]);

  const filteredNotifications = notifications.filter(notification => {
    if (filterStatus !== 'all' && notification.status !== filterStatus) return false;
    if (searchTerm && !notification.message.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'sent': return 'bg-green-100 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return Mail;
      case 'sms': return MessageSquare;
      case 'push': return Bell;
      default: return Send;
    }
  };

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case 'appointment_booked': return CheckCircle;
      case 'appointment_reminder': return Clock;
      case 'appointment_cancelled': return AlertCircle;
      default: return Bell;
    }
  };

  const toggleRule = async (ruleId: string, isActive: boolean) => {
    toast({
      title: isActive ? "Rule Activated" : "Rule Deactivated",
      description: `Notification rule has been ${isActive ? 'activated' : 'deactivated'}`,
    });
  };

  const sendTestNotification = async (ruleId: string) => {
    toast({
      title: "Test Notification Sent",
      description: "A test notification has been sent to your contact information",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bell className="h-8 w-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold">Notification Center</h2>
          <p className="text-muted-foreground">Manage automated patient communications</p>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.total_sent.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Sent</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.delivery_rate}%</div>
              <div className="text-sm text-muted-foreground">Delivery Rate</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{metrics.open_rate}%</div>
              <div className="text-sm text-muted-foreground">Open Rate</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{metrics.response_rate}%</div>
              <div className="text-sm text-muted-foreground">Response Rate</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{metrics.avg_response_time}h</div>
              <div className="text-sm text-muted-foreground">Avg Response</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        {[
          { id: 'queue', label: 'Notification Queue', icon: Bell },
          { id: 'rules', label: 'Automation Rules', icon: Zap },
          { id: 'templates', label: 'Templates', icon: Mail },
          { id: 'analytics', label: 'Analytics', icon: Target }
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

      {/* Notification Queue Tab */}
      {activeTab === 'queue' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Notification
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Notification Queue</CardTitle>
              <CardDescription>
                Scheduled and sent notifications to patients
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Loading notifications...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => {
                    const ChannelIcon = getChannelIcon(notification.channel);
                    
                    return (
                      <div key={notification.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3">
                              <ChannelIcon className="h-5 w-5 text-muted-foreground" />
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(notification.status)}>
                                  {notification.status}
                                </Badge>
                                <Badge variant="outline">{notification.type}</Badge>
                              </div>
                            </div>
                            
                            <div>
                              <div className="font-medium">To: {notification.recipient}</div>
                              <div className="text-sm text-muted-foreground">
                                Scheduled for: {new Date(notification.scheduled_for).toLocaleString()}
                              </div>
                              {notification.sent_at && (
                                <div className="text-sm text-muted-foreground">
                                  Sent at: {new Date(notification.sent_at).toLocaleString()}
                                </div>
                              )}
                            </div>
                            
                            <div className="bg-muted/50 p-3 rounded text-sm">
                              {notification.message}
                            </div>
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            {notification.status === 'pending' && (
                              <Button variant="outline" size="sm">
                                Cancel
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {filteredNotifications.length === 0 && (
                    <div className="text-center py-8">
                      <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">No notifications found</h3>
                      <p className="text-muted-foreground">
                        {searchTerm || filterStatus !== 'all'
                          ? "No notifications match your current filters"
                          : "No notifications have been scheduled yet"
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Automation Rules Tab */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Automation Rules</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </div>
          
          <div className="grid gap-4">
            {rules.map((rule) => {
              const TriggerIcon = getTriggerIcon(rule.trigger);
              
              return (
                <Card key={rule.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <TriggerIcon className="h-5 w-5 text-muted-foreground" />
                          <h3 className="font-semibold">{rule.name}</h3>
                          <Badge variant="outline">{rule.trigger.replace('_', ' ')}</Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{rule.description}</p>
                        
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{rule.timing}h {rule.timing > 0 ? 'before' : 'after'}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {rule.channels.map((channel) => {
                              const ChannelIcon = getChannelIcon(channel);
                              return (
                                <ChannelIcon key={channel} className="h-4 w-4" />
                              );
                            })}
                            <span>{rule.channels.join(', ')}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Success: {rule.success_rate}%</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Send className="h-4 w-4 text-blue-600" />
                            <span>Sent: {rule.total_sent.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="text-sm font-medium mb-1">Template Preview:</div>
                          <p className="text-sm italic">{rule.template}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 ml-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={rule.is_active}
                            onCheckedChange={(checked) => toggleRule(rule.id, checked)}
                          />
                          <span className="text-sm">{rule.is_active ? 'Active' : 'Inactive'}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => sendTestNotification(rule.id)}>
                            <Send className="h-4 w-4 mr-2" />
                            Test
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            Edit
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

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Message Templates</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Template Manager</CardTitle>
              <CardDescription>
                Create and manage reusable message templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Template Name</label>
                    <Input placeholder="Enter template name..." />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Channel</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select channel..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="push">Push Notification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Message Template</label>
                  <Textarea 
                    placeholder="Enter your message template... Use {{variable_name}} for dynamic content"
                    rows={4}
                  />
                </div>
                
                <div className="border rounded-lg p-4 bg-muted/50">
                  <h4 className="font-medium mb-2">Available Variables:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <code>{{patient_name}}</code>
                    <code>{{provider_name}}</code>
                    <code>{{appointment_date}}</code>
                    <code>{{appointment_time}}</code>
                    <code>{{practice_name}}</code>
                    <code>{{practice_phone}}</code>
                    <code>{{appointment_type}}</code>
                    <code>{{location}}</code>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button>
                    <Send className="h-4 w-4 mr-2" />
                    Save Template
                  </Button>
                  <Button variant="outline">
                    Preview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Notification Analytics</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Channel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </span>
                    <div className="text-right">
                      <div className="font-semibold">94% delivery</div>
                      <div className="text-sm text-muted-foreground">78% open rate</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      SMS
                    </span>
                    <div className="text-right">
                      <div className="font-semibold">98% delivery</div>
                      <div className="text-sm text-muted-foreground">92% read rate</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Push
                    </span>
                    <div className="text-right">
                      <div className="font-semibold">89% delivery</div>
                      <div className="text-sm text-muted-foreground">65% open rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Response Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Patient Engagement</span>
                    <span className="font-semibold">84%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>No-Show Reduction</span>
                    <span className="font-semibold">-23%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Patient Satisfaction</span>
                    <span className="font-semibold">4.7/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Saved</span>
                    <span className="font-semibold">15 hrs/week</span>
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