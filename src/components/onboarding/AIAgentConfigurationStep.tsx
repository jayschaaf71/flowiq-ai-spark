
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  Bot, 
  MessageSquare, 
  Calendar, 
  Phone, 
  Mail, 
  FileText,
  Settings,
  Zap,
  Clock,
  Shield
} from "lucide-react";
import { SpecialtyType, specialtyConfigs } from '@/utils/specialtyConfig';

interface AIAgentConfigurationStepProps {
  specialty: SpecialtyType;
  agentConfig: {
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
  };
  onUpdateAgentConfig: (config: any) => void;
}

export const AIAgentConfigurationStep = ({ 
  specialty, 
  agentConfig, 
  onUpdateAgentConfig 
}: AIAgentConfigurationStepProps) => {
  const specialtyConfig = specialtyConfigs[specialty];

  const aiAgents = [
    {
      id: 'receptionistAgent',
      name: 'AI Receptionist',
      icon: Phone,
      description: 'Handles appointment scheduling, basic inquiries, and phone calls',
      features: ['24/7 availability', 'Appointment booking', 'FAQ responses', 'Call screening'],
      specialty: `Trained specifically for ${specialtyConfig.brandName.toLowerCase()} practices`
    },
    {
      id: 'intakeAgent',
      name: 'Intake Processor',
      icon: FileText,
      description: 'Processes patient intake forms and extracts key information',
      features: ['Form processing', 'Data extraction', 'Alert generation', 'Workflow automation'],
      specialty: `Understands ${specialtyConfig.brandName.toLowerCase()}-specific forms and terminology`
    },
    {
      id: 'followUpAgent',
      name: 'Follow-up Assistant',
      icon: MessageSquare,
      description: 'Manages post-appointment follow-ups and patient communication',
      features: ['Automated follow-ups', 'Treatment reminders', 'Satisfaction surveys', 'Care coordination'],
      specialty: `Personalized for ${specialtyConfig.brandName.toLowerCase()} patient journeys`
    },
    {
      id: 'reminderAgent',
      name: 'Reminder System',
      icon: Clock,
      description: 'Sends appointment reminders and treatment notifications',
      features: ['SMS/Email reminders', 'Custom timing', 'Automated rescheduling', 'No-show reduction'],
      specialty: `Optimized for ${specialtyConfig.brandName.toLowerCase()} appointment patterns`
    }
  ];

  const handleAgentToggle = (agentId: string, enabled: boolean) => {
    onUpdateAgentConfig({
      ...agentConfig,
      [agentId]: enabled
    });
  };

  const handleAutomationLevelChange = (value: number[]) => {
    onUpdateAgentConfig({
      ...agentConfig,
      automationLevel: value[0]
    });
  };

  const getAutomationDescription = (level: number) => {
    if (level <= 25) return "Conservative - Minimal automation, maximum human oversight";
    if (level <= 50) return "Balanced - Moderate automation with staff approval";
    if (level <= 75) return "Proactive - High automation with exception handling";
    return "Autonomous - Maximum automation with smart decision making";
  };

  const enabledAgents = Object.values(agentConfig).filter(v => typeof v === 'boolean' && v).length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Configure Your AI Agents</h2>
        <p className="text-gray-600 text-lg">
          Choose which AI agents to activate for your {specialtyConfig.brandName.toLowerCase()} practice.
        </p>
      </div>

      {/* Automation Level */}
      <Card className="border-2" style={{ borderColor: specialtyConfig.primaryColor + '20' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" style={{ color: specialtyConfig.primaryColor }} />
            Automation Level
          </CardTitle>
          <CardDescription>
            How much should your AI agents automate vs. requiring staff approval?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Conservative</span>
              <span className="text-sm font-medium">Autonomous</span>
            </div>
            <Slider
              value={[agentConfig.automationLevel]}
              onValueChange={handleAutomationLevelChange}
              max={100}
              step={25}
              className="w-full"
            />
            <div className="text-center">
              <Badge 
                variant="secondary"
                style={{ 
                  backgroundColor: specialtyConfig.primaryColor + '15',
                  color: specialtyConfig.primaryColor 
                }}
              >
                {agentConfig.automationLevel}% Automation
              </Badge>
              <p className="text-sm text-gray-600 mt-2">
                {getAutomationDescription(agentConfig.automationLevel)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aiAgents.map((agent) => {
          const Icon = agent.icon;
          const isEnabled = agentConfig[agent.id as keyof typeof agentConfig] as boolean;
          
          return (
            <Card 
              key={agent.id}
              className={`transition-all duration-200 ${
                isEnabled 
                  ? 'ring-2 shadow-lg' 
                  : 'border hover:border-gray-300'
              }`}
              style={{
                ringColor: isEnabled ? specialtyConfig.primaryColor : undefined,
                backgroundColor: isEnabled ? specialtyConfig.primaryColor + '05' : undefined
              }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ 
                        backgroundColor: isEnabled ? specialtyConfig.primaryColor : '#f3f4f6',
                        color: isEnabled ? 'white' : '#6b7280'
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                    </div>
                  </div>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={(checked) => handleAgentToggle(agent.id, checked)}
                  />
                </div>
                <CardDescription className="text-sm">
                  {agent.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium text-sm mb-2">Key Features:</p>
                  <ul className="space-y-1">
                    {agent.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <div 
                          className="w-1.5 h-1.5 rounded-full mr-2" 
                          style={{ backgroundColor: specialtyConfig.primaryColor }}
                        ></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-2 border-t">
                  <Badge 
                    variant="secondary" 
                    className="text-xs"
                    style={{ 
                      backgroundColor: specialtyConfig.primaryColor + '15',
                      color: specialtyConfig.primaryColor 
                    }}
                  >
                    <Bot className="w-3 h-3 mr-1" />
                    {agent.specialty}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Configuration Summary */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-green-600" />
            <h4 className="font-medium text-green-900">AI Configuration Summary</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">{enabledAgents}</div>
              <div className="text-sm text-green-600">AI Agents Enabled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">{agentConfig.automationLevel}%</div>
              <div className="text-sm text-green-600">Automation Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">24/7</div>
              <div className="text-sm text-green-600">AI Availability</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
