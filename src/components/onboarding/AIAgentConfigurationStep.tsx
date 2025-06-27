
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  MessageCircle, 
  Calendar, 
  FileText,
  Bell,
  Settings,
  Zap,
  CheckCircle
} from 'lucide-react';
import { SpecialtyType, getSpecialtyConfig } from '@/utils/specialtyConfig';

interface AgentConfig {
  receptionistAgent: boolean;
  intakeAgent: boolean;
  followUpAgent: boolean;
  reminderAgent: boolean;
  automationLevel: number;
  businessHours: {
    start: string;
    end: string;
    timezone: string;
  };
}

interface AIAgentConfigurationStepProps {
  specialty: SpecialtyType;
  agentConfig: AgentConfig;
  onUpdateAgentConfig: (config: AgentConfig) => void;
}

const agentTypes = [
  {
    id: 'receptionistAgent',
    name: 'Receptionist Agent',
    description: 'Handles phone calls, scheduling, and basic patient inquiries',
    icon: MessageCircle,
    color: 'blue',
    features: ['24/7 Phone Coverage', 'Appointment Scheduling', 'Basic Q&A', 'Call Routing']
  },
  {
    id: 'intakeAgent',
    name: 'Intake Agent',
    description: 'Manages new patient onboarding and form completion',
    icon: FileText,
    color: 'green',
    features: ['Form Pre-population', 'Document Collection', 'Insurance Verification', 'Welcome Sequences']
  },
  {
    id: 'followUpAgent',
    name: 'Follow-up Agent',
    description: 'Automates post-appointment care and patient engagement',
    icon: Bell,
    color: 'purple',
    features: ['Post-care Instructions', 'Satisfaction Surveys', 'Recovery Check-ins', 'Outcome Tracking']
  },
  {
    id: 'reminderAgent',
    name: 'Reminder Agent',
    description: 'Sends appointment reminders and medication alerts',
    icon: Calendar,
    color: 'orange',
    features: ['Appointment Reminders', 'Medication Alerts', 'Preventive Care', 'Custom Notifications']
  }
];

export const AIAgentConfigurationStep: React.FC<AIAgentConfigurationStepProps> = ({
  specialty,
  agentConfig,
  onUpdateAgentConfig
}) => {
  const [config, setConfig] = useState<AgentConfig>(agentConfig);
  const specialtyConfig = getSpecialtyConfig(specialty);

  const updateConfig = (updates: Partial<AgentConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onUpdateAgentConfig(newConfig);
  };

  const toggleAgent = (agentId: keyof AgentConfig) => {
    if (typeof config[agentId] === 'boolean') {
      updateConfig({ [agentId]: !config[agentId] });
    }
  };

  const enabledAgents = agentTypes.filter(agent => 
    config[agent.id as keyof AgentConfig] === true
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Configure your AI agents</h2>
        <p className="text-gray-600">
          Select which AI agents will help automate your {specialtyConfig.name.toLowerCase()} practice
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agentTypes.map((agent) => {
          const Icon = agent.icon;
          const isEnabled = config[agent.id as keyof AgentConfig] === true;
          const isRecommended = specialtyConfig.defaultAgents.includes(agent.id.replace('Agent', ''));
          
          return (
            <Card
              key={agent.id}
              className={`cursor-pointer transition-all duration-200 ${
                isEnabled 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => toggleAgent(agent.id as keyof AgentConfig)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${agent.color}-100`}>
                      <Icon className={`w-5 h-5 text-${agent.color}-600`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <div className="flex gap-2 mt-1">
                        {isRecommended && (
                          <Badge variant="secondary" className="text-xs">
                            Recommended
                          </Badge>
                        )}
                        {isEnabled && (
                          <Badge className="text-xs bg-green-100 text-green-800">
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={() => toggleAgent(agent.id as keyof AgentConfig)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3 text-sm">
                  {agent.description}
                </p>
                <div className="space-y-1">
                  {agent.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {enabledAgents.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Automation Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Automation Level</label>
                <Badge variant="outline">{config.automationLevel}%</Badge>
              </div>
              <Slider
                value={[config.automationLevel]}
                onValueChange={(value) => updateConfig({ automationLevel: value[0] })}
                max={100}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Conservative</span>
                <span>Balanced</span>
                <span>Aggressive</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Business Hours Start</label>
                <input
                  type="time"
                  value={config.businessHours.start}
                  onChange={(e) => updateConfig({
                    businessHours: { ...config.businessHours, start: e.target.value }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Business Hours End</label>
                <input
                  type="time"
                  value={config.businessHours.end}
                  onChange={(e) => updateConfig({
                    businessHours: { ...config.businessHours, end: e.target.value }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Timezone</label>
                <select
                  value={config.businessHours.timezone}
                  onChange={(e) => updateConfig({
                    businessHours: { ...config.businessHours, timezone: e.target.value }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-900">AI Agent Benefits</h4>
            <p className="text-sm text-yellow-800 mb-2">
              Your selected agents will work 24/7 to:
            </p>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Reduce administrative workload by up to 60%</li>
              <li>• Improve patient satisfaction with instant responses</li>
              <li>• Increase appointment booking rates</li>
              <li>• Ensure consistent follow-up care</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
