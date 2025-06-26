
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  ClipboardList, 
  Bell, 
  CreditCard, 
  Receipt, 
  MessageSquare, 
  Stethoscope,
  CheckCircle
} from "lucide-react";
import { SetupData } from "@/pages/PracticeSetup";

interface AgentSelectionStepProps {
  setupData: SetupData;
  updateSetupData: (updates: Partial<SetupData>) => void;
}

const availableAgents = [
  {
    id: 'schedule-iq',
    name: 'Schedule iQ',
    description: 'Automate appointment booking, rescheduling, and calendar management',
    icon: Calendar,
    benefits: ['Reduces double bookings', '24/7 online booking', 'Smart scheduling optimization'],
    recommended: true,
    category: 'Essential'
  },
  {
    id: 'intake-iq',
    name: 'Intake iQ',
    description: 'Digital intake forms, consent collection, and patient onboarding',
    icon: ClipboardList,
    benefits: ['Paperless intake process', 'E-signature collection', 'HIPAA compliant forms'],
    recommended: true,
    category: 'Essential'
  },
  {
    id: 'remind-iq',
    name: 'Reminders iQ',
    description: 'Automated appointment reminders and follow-up communications',
    icon: Bell,
    benefits: ['Reduces no-shows by 40%', 'Customizable reminder templates', 'Multi-channel messaging'],
    recommended: true,
    category: 'Essential'
  },
  {
    id: 'billing-iq',
    name: 'Billing iQ',
    description: 'Insurance verification, invoicing, and payment processing',
    icon: CreditCard,
    benefits: ['Real-time insurance verification', 'Automated invoicing', 'Payment plan management'],
    recommended: false,
    category: 'Operations'
  },
  {
    id: 'claims-iq',
    name: 'Claims iQ',
    description: 'Insurance claims submission, tracking, and denial management',
    icon: Receipt,
    benefits: ['Faster claim processing', 'Denial tracking & resubmission', 'Revenue optimization'],
    recommended: false,
    category: 'Operations'
  },
  {
    id: 'assist-iq',
    name: 'Assist iQ',
    description: 'AI-powered staff assistant for questions and workflow guidance',
    icon: MessageSquare,
    benefits: ['Instant staff support', 'Workflow optimization tips', 'Best practice recommendations'],
    recommended: false,
    category: 'Support'
  },
  {
    id: 'scribe-iq',
    name: 'Scribe iQ',
    description: 'AI medical scribe for appointment notes and documentation',
    icon: Stethoscope,
    benefits: ['Automated documentation', 'Voice-to-text transcription', 'Template generation'],
    recommended: false,
    category: 'Clinical'
  }
];

export const AgentSelectionStep = ({ setupData, updateSetupData }: AgentSelectionStepProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = ['all', 'Essential', 'Operations', 'Support', 'Clinical'];

  const handleAgentToggle = (agentId: string) => {
    const currentAgents = setupData.selectedAgents;
    const isSelected = currentAgents.includes(agentId);
    
    const updatedAgents = isSelected
      ? currentAgents.filter(id => id !== agentId)
      : [...currentAgents, agentId];
    
    updateSetupData({ selectedAgents: updatedAgents });
  };

  const selectRecommended = () => {
    const recommendedAgents = availableAgents
      .filter(agent => agent.recommended)
      .map(agent => agent.id);
    updateSetupData({ selectedAgents: recommendedAgents });
  };

  const filteredAgents = selectedCategory === 'all' 
    ? availableAgents 
    : availableAgents.filter(agent => agent.category === selectedCategory);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Choose your AI agents</h2>
        <p className="text-gray-600">
          Select the AI agents you want to activate. You can always add more later.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button 
          variant="outline" 
          size="sm"
          onClick={selectRecommended}
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Select Recommended
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'All Agents' : category}
          </Button>
        ))}
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredAgents.map((agent) => {
          const Icon = agent.icon;
          const isSelected = setupData.selectedAgents.includes(agent.id);
          
          return (
            <Card 
              key={agent.id}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                  : 'hover:shadow-md hover:border-gray-300'
              }`}
              onClick={() => handleAgentToggle(agent.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <Checkbox 
                    checked={isSelected}
                    onChange={() => handleAgentToggle(agent.id)}
                    className="mt-1"
                  />
                  <div className={`p-2 rounded-lg ${
                    isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      {agent.recommended && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-sm mt-1">
                      {agent.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-700 mb-2">Key Benefits:</p>
                  {agent.benefits.map((benefit, index) => (
                    <div key={index} className="text-xs text-gray-600 flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></div>
                      {benefit}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {setupData.selectedAgents.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-medium text-green-900 mb-2">
            Great choice! You've selected {setupData.selectedAgents.length} AI agent{setupData.selectedAgents.length !== 1 ? 's' : ''}
          </h3>
          <p className="text-sm text-green-800">
            These agents will start working for your practice immediately after setup. 
            You can always add more agents or adjust settings later from your dashboard.
          </p>
        </div>
      )}
    </div>
  );
};
