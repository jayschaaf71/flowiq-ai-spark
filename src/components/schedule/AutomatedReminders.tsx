
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Clock, MessageSquare, Mail, Bell, Send, Settings } from "lucide-react";

interface ReminderRule {
  id: string;
  name: string;
  type: "sms" | "email" | "both";
  timing: number; // hours before appointment
  enabled: boolean;
  template: string;
}

interface PendingReminder {
  id: string;
  appointmentId: string;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  type: "sms" | "email";
  scheduledFor: string;
  status: "pending" | "sent" | "failed";
}

export const AutomatedReminders = () => {
  const { toast } = useToast();
  const [reminderRules, setReminderRules] = useState<ReminderRule[]>([]);
  const [pendingReminders, setPendingReminders] = useState<PendingReminder[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReminderSettings();
    loadPendingReminders();
  }, []);

  const loadReminderSettings = () => {
    const defaultRules: ReminderRule[] = [
      {
        id: "1",
        name: "24 Hour Reminder",
        type: "both",
        timing: 24,
        enabled: true,
        template: "Hi {patientName}, this is a reminder of your {appointmentType} appointment tomorrow at {time} with {provider}. Please reply CONFIRM or call us at (555) 123-4567."
      },
      {
        id: "2", 
        name: "2 Hour Reminder",
        type: "sms",
        timing: 2,
        enabled: true,
        template: "Hi {patientName}, your appointment with {provider} is in 2 hours at {time}. See you soon!"
      },
      {
        id: "3",
        name: "1 Week Reminder",
        type: "email",
        timing: 168, // 7 days * 24 hours
        enabled: false,
        template: "Dear {patientName}, you have an upcoming {appointmentType} appointment on {date} at {time}. Please confirm your attendance."
      }
    ];
    setReminderRules(defaultRules);
  };

  const loadPendingReminders = () => {
    const mockReminders: PendingReminder[] = [
      {
        id: "1",
        appointmentId: "apt-1",
        patientName: "John Smith",
        appointmentDate: "2024-01-16",
        appointmentTime: "09:00",
        type: "sms",
        scheduledFor: "2024-01-15T09:00:00",
        status: "pending"
      },
      {
        id: "2",
        appointmentId: "apt-2",
        patientName: "Sarah Wilson",
        appointmentDate: "2024-01-16",
        appointmentTime: "10:30",
        type: "email",
        scheduledFor: "2024-01-15T10:30:00",
        status: "pending"
      }
    ];
    setPendingReminders(mockReminders);
  };

  const toggleReminderRule = async (ruleId: string) => {
    setLoading(true);
    try {
      setReminderRules(prev => prev.map(rule => 
        rule.id === ruleId 
          ? { ...rule, enabled: !rule.enabled }
          : rule
      ));
      
      toast({
        title: "Reminder Settings Updated",
        description: "Changes saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reminder settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendReminderNow = async (reminderId: string) => {
    setLoading(true);
    try {
      // Simulate sending reminder
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPendingReminders(prev => prev.map(reminder => 
        reminder.id === reminderId 
          ? { ...reminder, status: "sent" as const }
          : reminder
      ));
      
      const reminder = pendingReminders.find(r => r.id === reminderId);
      toast({
        title: "Reminder Sent",
        description: `${reminder?.type.toUpperCase()} reminder sent to ${reminder?.patientName}`,
      });
    } catch (error) {
      toast({
        title: "Send Failed",
        description: "Failed to send reminder",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent": return "bg-green-100 text-green-700";
      case "failed": return "bg-red-100 text-red-700";
      default: return "bg-yellow-100 text-yellow-700";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sms": return <MessageSquare className="h-4 w-4" />;
      case "email": return <Mail className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Reminder Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-600" />
            Automated Reminder Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reminderRules.map((rule) => (
              <div key={rule.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(rule.type)}
                    <div>
                      <div className="font-medium">{rule.name}</div>
                      <div className="text-sm text-gray-600">
                        Send {rule.type} {rule.timing} hours before appointment
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`rule-${rule.id}`} className="text-sm">
                      {rule.enabled ? "Enabled" : "Disabled"}
                    </Label>
                    <Switch
                      id={`rule-${rule.id}`}
                      checked={rule.enabled}
                      onCheckedChange={() => toggleReminderRule(rule.id)}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  <strong>Template:</strong> {rule.template}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Pending Reminders ({pendingReminders.filter(r => r.status === "pending").length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingReminders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No pending reminders</p>
          ) : (
            <div className="space-y-3">
              {pendingReminders.map((reminder) => (
                <div key={reminder.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(reminder.type)}
                      <div>
                        <div className="font-medium">{reminder.patientName}</div>
                        <div className="text-sm text-gray-600">
                          Appointment: {reminder.appointmentDate} at {reminder.appointmentTime}
                        </div>
                        <div className="text-xs text-gray-500">
                          Scheduled: {new Date(reminder.scheduledFor).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(reminder.status)}>
                        {reminder.status}
                      </Badge>
                      {reminder.status === "pending" && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => sendReminderNow(reminder.id)}
                          disabled={loading}
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Send Now
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reminder Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">94%</div>
              <div className="text-sm text-gray-600">Delivery Rate</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-gray-600">Sent Today</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">87%</div>
              <div className="text-sm text-gray-600">Response Rate</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
