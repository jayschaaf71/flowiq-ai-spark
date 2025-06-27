
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Zap, Calendar, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AutomationRule {
  id: string;
  name: string;
  type: 'optimization' | 'notification' | 'booking';
  enabled: boolean;
  config: {
    trigger?: string;
    action?: string;
    timing?: number;
  };
}

export const RealTimeScheduleManager: React.FC = () => {
  const { toast } = useToast();
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);

  useEffect(() => {
    loadAutomationRules();
    setupRealTimeSubscriptions();
  }, []);

  const loadAutomationRules = () => {
    const defaultRules: AutomationRule[] = [
      {
        id: '1',
        name: 'Auto Schedule Optimization',
        type: 'optimization',
        enabled: true,
        config: {
          trigger: 'daily',
          action: 'optimize_schedule',
          timing: 480 // 8 AM
        }
      },
      {
        id: '2',
        name: 'Instant Booking Confirmations',
        type: 'notification',
        enabled: true,
        config: {
          trigger: 'appointment_booked',
          action: 'send_confirmation',
          timing: 0
        }
      },
      {
        id: '3',
        name: 'Auto-fill from Waitlist',
        type: 'booking',
        enabled: true,
        config: {
          trigger: 'cancellation',
          action: 'check_waitlist',
          timing: 5
        }
      },
      {
        id: '4',
        name: '24-hour Reminders',
        type: 'notification',
        enabled: true,
        config: {
          trigger: 'scheduled',
          action: 'send_reminder',
          timing: 1440 // 24 hours
        }
      }
    ];
    setAutomationRules(defaultRules);
  };

  const setupRealTimeSubscriptions = () => {
    if (!realTimeEnabled) return;

    const appointmentChannel = supabase
      .channel('appointment-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          handleAppointmentChange(payload);
        }
      )
      .subscribe();

    const waitlistChannel = supabase
      .channel('waitlist-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointment_waitlist'
        },
        (payload) => {
          handleWaitlistChange(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(appointmentChannel);
      supabase.removeChannel(waitlistChannel);
    };
  };

  const handleAppointmentChange = async (payload: any) => {
    console.log('Appointment change detected:', payload);
    
    if (payload.eventType === 'INSERT') {
      await triggerAutomation('appointment_booked', payload.new);
    } else if (payload.eventType === 'UPDATE' && payload.new.status === 'cancelled') {
      await triggerAutomation('cancellation', payload.new);
    }
  };

  const handleWaitlistChange = async (payload: any) => {
    console.log('Waitlist change detected:', payload);
    
    if (payload.eventType === 'INSERT') {
      await triggerAutomation('waitlist_added', payload.new);
    }
  };

  const triggerAutomation = async (trigger: string, data: any) => {
    const applicableRules = automationRules.filter(
      rule => rule.enabled && rule.config.trigger === trigger
    );

    for (const rule of applicableRules) {
      try {
        await executeAutomation(rule, data);
      } catch (error) {
        console.error(`Automation ${rule.name} failed:`, error);
      }
    }
  };

  const executeAutomation = async (rule: AutomationRule, data: any) => {
    switch (rule.config.action) {
      case 'send_confirmation':
        await sendConfirmation(data);
        break;
      case 'send_reminder':
        await scheduleReminder(data, rule.config.timing || 0);
        break;
      case 'check_waitlist':
        await processWaitlist(data);
        break;
      case 'optimize_schedule':
        await optimizeSchedule();
        break;
    }
  };

  const sendConfirmation = async (appointment: any) => {
    // Simulate sending confirmation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast({
      title: "Confirmation Sent",
      description: `Booking confirmation sent for ${appointment.title}`,
    });
  };

  const scheduleReminder = async (appointment: any, delayMinutes: number) => {
    // Simulate scheduling reminder
    await new Promise(resolve => setTimeout(resolve, 300));
    
    toast({
      title: "Reminder Scheduled",
      description: `Reminder set for ${delayMinutes} minutes before appointment`,
    });
  };

  const processWaitlist = async (cancelledAppointment: any) => {
    // Simulate checking waitlist for suitable replacement
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Waitlist Processed",
      description: "Checking waitlist for available patients",
    });
  };

  const optimizeSchedule = async () => {
    // Simulate schedule optimization
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Schedule Optimized",
      description: "Daily schedule optimization completed",
    });
  };

  const toggleAutomation = (ruleId: string) => {
    setAutomationRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, enabled: !rule.enabled }
        : rule
    ));
  };

  const testAutomation = async (rule: AutomationRule) => {
    setLoading(true);
    try {
      await executeAutomation(rule, { test: true });
      toast({
        title: "Test Successful",
        description: `${rule.name} automation tested successfully`,
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Automation test failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <Zap className="h-4 w-4 text-yellow-600" />;
      case 'notification': return <Bell className="h-4 w-4 text-blue-600" />;
      case 'booking': return <Calendar className="h-4 w-4 text-green-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Zap className="h-8 w-8 text-yellow-600" />
        <div>
          <h2 className="text-2xl font-bold">Real-time Schedule Manager</h2>
          <p className="text-gray-600">Automated scheduling, notifications, and optimization</p>
        </div>
      </div>

      {/* Real-time Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Real-time Features
            <div className="flex items-center space-x-2">
              <Label htmlFor="realtime-toggle">Enable Real-time</Label>
              <Switch
                id="realtime-toggle"
                checked={realTimeEnabled}
                onCheckedChange={setRealTimeEnabled}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Bell className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="font-medium">Auto Notifications</div>
              <Badge className={realTimeEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                {realTimeEnabled ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <div className="font-medium">Schedule Optimization</div>
              <Badge className={realTimeEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                {realTimeEnabled ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="font-medium">Waitlist Processing</div>
              <Badge className={realTimeEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                {realTimeEnabled ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Automation Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Automation Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {automationRules.map((rule) => (
              <div key={rule.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(rule.type)}
                    <div>
                      <div className="font-medium">{rule.name}</div>
                      <div className="text-sm text-gray-600 capitalize">
                        {rule.type} • Trigger: {rule.config.trigger}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testAutomation(rule)}
                      disabled={loading}
                    >
                      Test
                    </Button>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`rule-${rule.id}`} className="text-sm">
                        {rule.enabled ? "On" : "Off"}
                      </Label>
                      <Switch
                        id={`rule-${rule.id}`}
                        checked={rule.enabled}
                        onCheckedChange={() => toggleAutomation(rule.id)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
