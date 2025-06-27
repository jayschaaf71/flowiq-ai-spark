
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
  CheckCircle,
  ClipboardList,
  CreditCard,
  Receipt,
  MessageSquare,
  Stethoscope
} from 'lucide-react';
import { SpecialtyType, getSpecialtyConfig } from '@/utils/specialtyConfig';

interface AgentConfig {
  'schedule-iq': boolean;
  'intake-iq': boolean;
  'remind-iq': boolean;
  'billing-iq': boolean;
  'claims-iq': boolean;
  'assist-iq': boolean;
  'scribe-iq': boolean;
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
    id: 'schedule-iq',
    name: 'Schedule iQ',
    description: 'Automate appointment booking, rescheduling, and calendar management',
    icon: Calendar,
    color: 'blue',
    features: ['Reduces double bookings', '24/7 online booking', 'Smart scheduling optimization', 'Calendar integration'],
    recommended: true,
    category: 'Essential'
  },
  {
    id: 'intake-iq',
    name: 'Intake iQ',
    description: 'Digital intake forms, consent collection, and patient onboarding',
    icon: ClipboardList,
    color: 'green',
    features: ['Paperless intake process', 'E-signature collection', 'HIPAA compliant forms', 'Auto form pre-population'],
    recommended: true,
    category: 'Essential'
  },
  {
    id: 'remind-iq',
    name: 'Reminders iQ',
    description: 'Automated appointment reminders and follow-up communications',
    icon: Bell,
    color: 'orange',
    features: ['Reduces no-shows by 40%', 'Customizable reminder templates', 'Multi-channel messaging', 'Smart timing'],
    recommended: true,
    category: 'Essential'
  },
  {
    id: 'billing-iq',
    name: 'Billing iQ',
    description: 'Insurance verification, invoicing, and payment processing',
    icon: CreditCard,
    color: 'purple',
    features: ['Real-time insurance verification', 'Automated invoicing', 'Payment plan management', 'Revenue tracking'],
    recommended: false,
    category: 'Operations'
  },
  {
    id: 'claims-iq',
    name: 'Claims iQ',
    description: 'Insurance claims submission, tracking, and denial management',
    icon: Receipt,
    color: 'indigo',
    features: ['Faster claim processing', 'Denial tracking & resubmission', 'Revenue optimization', 'Compliance monitoring'],
    recommended: false,
    category: 'Operations'
  },
  {
    id: 'assist-iq',
    name: 'Assist iQ',
    description: 'AI-powered staff assistant for questions and workflow guidance',
    icon: MessageSquare,
    color: 'cyan',
    features: ['Instant staff support', 'Workflow optimization tips', 'Best practice recommendations', '24/7 availability'],
    recommended: false,
    category: 'Support'
  },
  {
    id: 'scribe-iq',
    name: 'Scribe iQ',
    description: 'AI medical scribe for appointment notes and documentation',
    icon: Stethoscope,
    color: 'red',
    features: ['Automated documentation', 'Voice-to-text transcription', 'Template generation', 'SOAP note creation'],
    recommended: false,
    category: 'Clinical'
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

  const selectRecommended = () => {
    const recommendedAgents = agentTypes
      .filter(agent => agent.recommended)
      .reduce((acc, agent) => {
        acc[agent.id as keyof AgentConfig] = true;
        return acc;
      }, {} as Partial<AgentConfig>);
    
    updateConfig(recommendedAgents);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Configure your AI agents</h2>
        <p className="text-gray-600">
          Select which AI agents will help automate your {specialtyConfig.name.toLowerCase()} practice
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={selectRecommended}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100"
        >
          <CheckCircle className="w-4 h-4" />
          Select Recommended
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agentTypes.map((agent) => {
          const Icon = agent.icon;
          const isEnabled = config[agent.id as keyof AgentConfig] === true;
          const isRecommended = agent.recommended;
          
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
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                            Recommended
                          </Badge>
                        )}
                        {isEnabled && (
                          <Badge className="text-xs bg-blue-100 text-blue-800">
                            Active
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {agent.category}
                        </Badge>
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
            <h4 className="font-medium text-yellow-900">Selected Agents Summary</h4>
            <p className="text-sm text-yellow-800 mb-2">
              You've selected {enabledAgents.length} agent{enabledAgents.length !== 1 ? 's' : ''} that will:
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
