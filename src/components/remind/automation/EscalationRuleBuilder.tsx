
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Plus, Settings, Trash2 } from "lucide-react";

interface EscalationRule {
  id: string;
  name: string;
  trigger: {
    type: 'no_response' | 'no_show' | 'failed_delivery' | 'negative_sentiment';
    timeDelay: number;
    conditions: string[];
  };
  actions: {
    type: 'sms' | 'email' | 'call' | 'staff_notification' | 'manager_alert';
    priority: 'low' | 'medium' | 'high';
    template: string;
    assignTo?: string;
  }[];
  isActive: boolean;
  createdAt: string;
  lastTriggered?: string;
  triggerCount: number;
}

export const EscalationRuleBuilder = () => {
  const [rules, setRules] = useState<EscalationRule[]>([
    {
      id: "1",
      name: "No Response - High Priority Patients",
      trigger: {
        type: 'no_response',
        timeDelay: 2,
        conditions: ['patient_priority = high', 'appointment_type = consultation']
      },
      actions: [
        {
          type: 'call',
          priority: 'high',
          template: 'urgent_followup_call',
          assignTo: 'front_desk'
        },
        {
          type: 'manager_alert',
          priority: 'medium',
          template: 'manager_notification'
        }
      ],
      isActive: true,
      createdAt: '2024-01-15',
      triggerCount: 12,
      lastTriggered: '2024-01-20'
    },
    {
      id: "2",
      name: "No Show Follow-up",
      trigger: {
        type: 'no_show',
        timeDelay: 1,
        conditions: ['appointment_status = no_show']
      },
      actions: [
        {
          type: 'sms',
          priority: 'medium',
          template: 'no_show_reschedule'
        }
      ],
      isActive: true,
      createdAt: '2024-01-10',
      triggerCount: 8,
      lastTriggered: '2024-01-19'
    }
  ]);

  const [showRuleBuilder, setShowRuleBuilder] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    triggerType: '',
    timeDelay: 1,
    actionType: '',
    priority: 'medium'
  });

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, isActive: !rule.isActive }
        : rule
    ));
  };

  const deleteRule = (ruleId: string) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5 text-orange-600" />
            Escalation Rule Builder
          </h3>
          <p className="text-sm text-gray-600">
            Create and manage automated escalation workflows
          </p>
        </div>
        <Button onClick={() => setShowRuleBuilder(!showRuleBuilder)}>
          <Plus className="w-4 h-4 mr-2" />
          New Rule
        </Button>
      </div>

      {showRuleBuilder && (
        <Card className="border-2 border-dashed border-blue-200">
          <CardHeader>
            <CardTitle>Create New Escalation Rule</CardTitle>
            <CardDescription>
              Define triggers and actions for automated patient follow-up
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Rule Name</label>
                <Input 
                  placeholder="e.g., High Priority No Response"
                  value={newRule.name}
                  onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Trigger Type</label>
                <Select 
                  value={newRule.triggerType} 
                  onValueChange={(value) => setNewRule({...newRule, triggerType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no_response">No Response</SelectItem>
                    <SelectItem value="no_show">No Show</SelectItem>
                    <SelectItem value="failed_delivery">Failed Delivery</SelectItem>
                    <SelectItem value="negative_sentiment">Negative Sentiment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Time Delay (hours)</label>
                <Input 
                  type="number"
                  min="1"
                  value={newRule.timeDelay}
                  onChange={(e) => setNewRule({...newRule, timeDelay: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Action Type</label>
                <Select 
                  value={newRule.actionType} 
                  onValueChange={(value) => setNewRule({...newRule, actionType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sms">Send SMS</SelectItem>
                    <SelectItem value="email">Send Email</SelectItem>
                    <SelectItem value="call">Make Call</SelectItem>
                    <SelectItem value="staff_notification">Notify Staff</SelectItem>
                    <SelectItem value="manager_alert">Alert Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Priority</label>
                <Select 
                  value={newRule.priority} 
                  onValueChange={(value) => setNewRule({...newRule, priority: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Conditions (optional)</label>
              <Textarea 
                placeholder="e.g., patient_priority = high, appointment_type = consultation"
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <Button className="flex-1">Create Rule</Button>
              <Button variant="outline" onClick={() => setShowRuleBuilder(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {rules.map((rule) => (
          <Card key={rule.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{rule.name}</CardTitle>
                  <CardDescription>
                    Trigger: {rule.trigger.type.replace('_', ' ')} after {rule.trigger.timeDelay} hours
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={rule.isActive ? "default" : "secondary"}>
                    {rule.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Switch
                    checked={rule.isActive}
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Actions:</h4>
                  <div className="space-y-2">
                    {rule.actions.map((action, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                          <span className="capitalize">{action.type.replace('_', ' ')}</span>
                          {action.assignTo && (
                            <span className="text-sm text-gray-600">
                              → {action.assignTo}
                            </span>
                          )}
                        </div>
                        <Badge className={getPriorityColor(action.priority)}>
                          {action.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>
                    Triggered {rule.triggerCount} times
                    {rule.lastTriggered && (
                      <span> • Last: {rule.lastTriggered}</span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteRule(rule.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
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
