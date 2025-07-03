import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Mail, MessageSquare, Calendar } from 'lucide-react';

export const MarketingAutomation = () => {
  const automationRules = [
    {
      id: 1,
      name: 'Welcome New Patients',
      trigger: 'new_patient',
      action: 'send_email',
      status: 'active',
      description: 'Send welcome email to new patient registrations'
    },
    {
      id: 2,
      name: 'Birthday Reminders',
      trigger: 'birthday',
      action: 'send_sms',
      status: 'active',
      description: 'Send birthday wishes and special offers'
    },
    {
      id: 3,
      name: 'Appointment Follow-up',
      trigger: 'appointment_completed',
      action: 'send_email',
      status: 'paused',
      description: 'Follow up after completed appointments'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Marketing Automation</h2>
          <p className="text-muted-foreground">AI-powered automated marketing workflows</p>
        </div>
        <Button>
          <Bot className="w-4 h-4 mr-2" />
          Create Rule
        </Button>
      </div>

      <div className="space-y-4">
        {automationRules.map((rule) => (
          <Card key={rule.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-blue-100">
                    {rule.action === 'send_email' ? (
                      <Mail className="w-5 h-5 text-blue-600" />
                    ) : rule.action === 'send_sms' ? (
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Calendar className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{rule.name}</h3>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">Trigger: {rule.trigger}</Badge>
                      <Badge variant="outline">Action: {rule.action}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={rule.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                    {rule.status}
                  </Badge>
                  <Button size="sm" variant="outline">
                    {rule.status === 'active' ? 'Pause' : 'Activate'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};