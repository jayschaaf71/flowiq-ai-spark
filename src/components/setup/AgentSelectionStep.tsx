
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
  CheckCircle,
  Package,
  Eye,
  Shield,
  GraduationCap,
  UserPlus,
  TrendingUp,
  Settings,
  FileText,
  BarChart3
} from "lucide-react";
import { SetupData } from "@/pages/PracticeSetup";

interface AgentSelectionStepProps {
  setupData: SetupData;
  updateSetupData: (updates: Partial<SetupData>) => void;
}

const availableAgents = [
  // Essential Agents
  {
    id: 'communication-iq',
    name: 'Communication iQ',
    description: 'Complete patient communication platform including scheduling, intake, follow-up, and appointment management',
    icon: MessageSquare,
    benefits: ['Multi-channel messaging', 'Smart scheduling', 'Digital intake', 'Automated follow-ups', 'Appointment management', 'No-show reduction'],
    recommended: true,
    category: 'Essential'
  },
  {
    id: 'assist-iq',
    name: 'Assist iQ',
    description: 'AI-powered staff assistant for workflow guidance and support',
    icon: MessageSquare,
    benefits: ['Instant staff support', 'Workflow optimization', 'Knowledge base access', 'Practice guidance'],
    recommended: false,
    category: 'Support'
  },

  // Clinical & Documentation
  {
    id: 'scribe-iq',
    name: 'Scribe iQ',
    description: 'AI medical scribe for automated clinical documentation',
    icon: Stethoscope,
    benefits: ['Voice-to-text transcription', 'SOAP note generation', 'Template automation', 'Clinical workflow integration'],
    recommended: false,
    category: 'Clinical'
  },
  {
    id: 'ehr-iq',
    name: 'EHR iQ',
    description: 'Electronic health records integration and management',
    icon: FileText,
    benefits: ['EHR system integration', 'Data synchronization', 'Clinical workflow automation', 'Records management'],
    recommended: false,
    category: 'Clinical'
  },

  // Financial & Revenue Cycle
  {
    id: 'billing-iq',
    name: 'Billing iQ',
    description: 'Automated billing and revenue cycle management',
    icon: CreditCard,
    benefits: ['Automated invoicing', 'Insurance verification', 'Payment processing', 'Revenue optimization'],
    recommended: false,
    category: 'Financial'
  },
  {
    id: 'claims-iq',
    name: 'Claims iQ',
    description: 'Insurance claims processing and denial management',
    icon: Receipt,
    benefits: ['Automated claim submission', 'Denial tracking', 'Resubmission workflows', 'Revenue recovery'],
    recommended: false,
    category: 'Financial'
  },
  {
    id: 'payments-iq',
    name: 'Payments iQ',
    description: 'Payment collection and processing automation',
    icon: TrendingUp,
    benefits: ['Payment plan management', 'Automated collections', 'Online payment processing', 'Financial reporting'],
    recommended: false,
    category: 'Financial'
  },
  {
    id: 'auth-iq',
    name: 'Auth iQ',
    description: 'Insurance authorization and prior approval management',
    icon: Shield,
    benefits: ['Prior authorization tracking', 'Insurance verification', 'Approval workflows', 'Compliance monitoring'],
    recommended: false,
    category: 'Financial'
  },

  // Operations & Management
  {
    id: 'inventory-iq',
    name: 'Inventory iQ',
    description: 'Smart inventory management with automated ordering',
    icon: Package,
    benefits: ['Automated reordering', 'Vendor management', 'Cost optimization', 'Stock level monitoring'],
    recommended: false,
    category: 'Operations'
  },
  {
    id: 'ops-iq',
    name: 'Ops iQ',
    description: 'Operational workflow automation and system monitoring',
    icon: Settings,
    benefits: ['Workflow automation', 'System monitoring', 'Process optimization', 'Performance tracking'],
    recommended: false,
    category: 'Operations'
  },

  // Analytics & Insights
  {
    id: 'insight-iq',
    name: 'Insight iQ',
    description: 'Business intelligence and practice analytics',
    icon: BarChart3,
    benefits: ['Performance analytics', 'Predictive insights', 'Custom reporting', 'Data visualization'],
    recommended: false,
    category: 'Analytics'
  },

  // Patient Experience & Education
  {
    id: 'education-iq',
    name: 'Education iQ',
    description: 'Patient education and engagement automation',
    icon: GraduationCap,
    benefits: ['Automated patient education', 'Engagement tracking', 'Custom content delivery', 'Health literacy improvement'],
    recommended: false,
    category: 'Patient Experience'
  },

  // Growth & Marketing
  {
    id: 'go-to-market-iq',
    name: 'Go-To-Market iQ',
    description: 'Comprehensive marketing and sales automation for practice growth',
    icon: TrendingUp,
    benefits: ['Lead generation', 'Sales automation', 'Campaign management', 'Social media', 'Review management', 'Patient acquisition'],
    recommended: false,
    category: 'Growth'
  },
  {
    id: 'referral-iq',
    name: 'Referral iQ',
    description: 'Referral management and physician relationship automation',
    icon: UserPlus,
    benefits: ['Referral tracking', 'Physician outreach', 'Relationship management', 'Communication automation'],
    recommended: false,
    category: 'Growth'
  }
];

export const AgentSelectionStep = ({ setupData, updateSetupData }: AgentSelectionStepProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Get all unique categories from agents, plus 'all'
  const uniqueCategories = [...new Set(availableAgents.map(agent => agent.category))];
  const categories = ['all', ...uniqueCategories.sort()];

  console.log('Available categories:', categories);
  console.log('Agents by category:', uniqueCategories.map(cat => ({
    category: cat,
    count: availableAgents.filter(a => a.category === cat).length,
    agents: availableAgents.filter(a => a.category === cat).map(a => a.name)
  })));

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
    setSelectedCategory('all'); // Show all agents after selection
  };

  const selectCategory = (category: string) => {
    console.log('Selecting category:', category);
    console.log('Current selected agents before:', setupData.selectedAgents);
    
    setSelectedCategory(category);
    
    if (category === 'all') {
      // Clear all selections when viewing all agents
      console.log('Clearing all selections for "All Agents" view');
      updateSetupData({ selectedAgents: [] });
    } else {
      // If selecting a specific category, auto-select all agents in that category
      const categoryAgents = availableAgents
        .filter(agent => agent.category === category)
        .map(agent => agent.id);
      
      console.log('Category agents to add:', categoryAgents);
      
      // Combine with any existing selections from other categories
      const currentSelections = setupData.selectedAgents.filter(agentId => {
        const agent = availableAgents.find(a => a.id === agentId);
        return agent && agent.category !== category; // Keep selections from other categories
      });
      
      console.log('Current selections from other categories:', currentSelections);
      
      const newSelections = [...currentSelections, ...categoryAgents];
      console.log('New selections after category selection:', newSelections);
      updateSetupData({ selectedAgents: newSelections });
    }
  };

  const filteredAgents = selectedCategory === 'all' 
    ? availableAgents 
    : availableAgents.filter(agent => agent.category === selectedCategory);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          Choose your AI agents ({filteredAgents.length} of {availableAgents.length} shown)
        </h2>
        <p className="text-gray-600">
          Select the AI agents you want to activate. You can always add more later.
        </p>
        {selectedCategory !== 'all' && (
          <p className="text-sm text-blue-600 mt-1">
            Filtering by: {selectedCategory} ({filteredAgents.length} agents)
          </p>
        )}
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
            onClick={() => selectCategory(category)}
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
