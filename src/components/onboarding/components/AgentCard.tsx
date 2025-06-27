
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { AgentType } from '../config/agentTypes';

interface AgentCardProps {
  agent: AgentType;
  isEnabled: boolean;
  onToggle: () => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  isEnabled,
  onToggle
}) => {
  const Icon = agent.icon;
  const isRecommended = agent.recommended;
  
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 ${
        isEnabled 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onToggle}
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
            onCheckedChange={onToggle}
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
};
