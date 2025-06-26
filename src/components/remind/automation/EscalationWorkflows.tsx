
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { EscalationRuleBuilder } from "./EscalationRuleBuilder";
import { 
  AlertTriangle, 
  Users, 
  Clock, 
  Phone,
  Mail,
  MessageSquare
} from "lucide-react";

interface EscalationRule {
  id: string;
  name: string;
  trigger: 'no_response' | 'no_show' | 'failed_delivery';
  timeDelay: number;
  action: 'call' | 'email' | 'sms' | 'staff_notification';
  isActive: boolean;
}

interface EscalationCase {
  id: string;
  patientName: string;
  patientPhone: string;
  appointmentDate: string;
  escalationReason: string;
  currentStep: number;
  status: 'active' | 'resolved' | 'cancelled';
  createdAt: string;
}

export const EscalationWorkflows = () => {
  const [rules, setRules] = useState<EscalationRule[]>([
    {
      id: "1",
      name: "No Response Follow-up",
      trigger: 'no_response',
      timeDelay: 2,
      action: 'call',
      isActive: true
    },
    {
      id: "2", 
      name: "No Show Follow-up",
      trigger: 'no_show',
      timeDelay: 1,
      action: 'sms',
      isActive: true
    }
  ]);
  
  const [cases, setCases] = useState<EscalationCase[]>([
    {
      id: "1",
      patientName: "John Smith",
      patientPhone: "+1234567890",
      appointmentDate: "2024-01-16",
      escalationReason: "No response to appointment reminder",
      currentStep: 1,
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ]);

  const { toast } = useToast();

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'call': return <Phone className="w-4 h-4 text-green-600" />;
      case 'email': return <Mail className="w-4 h-4 text-blue-600" />;
      case 'sms': return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case 'staff_notification': return <Users className="w-4 h-4 text-orange-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, isActive: !rule.isActive }
        : rule
    ));
    
    toast({
      title: "Rule Updated",
      description: "Escalation rule status has been changed",
    });
  };

  const resolveCase = (caseId: string) => {
    setCases(prev => prev.map(c => 
      c.id === caseId 
        ? { ...c, status: 'resolved' }
        : c
    ));
    
    toast({
      title: "Case Resolved",
      description: "Escalation case has been marked as resolved",
    });
  };

  const stats = {
    activeRules: rules.filter(r => r.isActive).length,
    activeCases: cases.filter(c => c.status === 'active').length,
    resolvedToday: cases.filter(c => c.status === 'resolved').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Escalation Workflows
          </h3>
          <p className="text-sm text-gray-600">
            Automated follow-up workflows for non-responsive patients
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{stats.activeRules}</p>
                <p className="text-sm text-gray-600">Active Rules</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{stats.activeCases}</p>
                <p className="text-sm text-gray-600">Active Cases</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.resolvedToday}</p>
                <p className="text-sm text-gray-600">Resolved Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Escalation Rule Builder Component */}
      <EscalationRuleBuilder />

      {/* Active Cases */}
      <Card>
        <CardHeader>
          <CardTitle>Active Escalation Cases</CardTitle>
          <CardDescription>
            Patients currently in escalation workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cases.filter(c => c.status === 'active').map((escalationCase) => (
              <div key={escalationCase.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium">{escalationCase.patientName}</p>
                    <p className="text-sm text-gray-600">
                      {escalationCase.escalationReason} - Step {escalationCase.currentStep}
                    </p>
                    <p className="text-xs text-gray-500">
                      Appointment: {escalationCase.appointmentDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(escalationCase.status)}>
                    {escalationCase.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => resolveCase(escalationCase.id)}
                  >
                    Resolve
                  </Button>
                </div>
              </div>
            ))}
            
            {cases.filter(c => c.status === 'active').length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p>No active escalation cases</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
