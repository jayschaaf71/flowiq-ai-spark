
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GitBranch, 
  Copy, 
  Eye, 
  Users, 
  Calendar, 
  CreditCard, 
  FileText, 
  Phone, 
  Heart 
} from "lucide-react";

interface WorkflowTemplatesExpandedProps {
  onUseTemplate: (template: any) => void;
}

export const WorkflowTemplatesExpanded = ({ onUseTemplate }: WorkflowTemplatesExpandedProps) => {
  const templates = [
    {
      id: "patient-onboarding",
      name: "Complete Patient Onboarding",
      description: "End-to-end patient registration and intake process",
      category: "Patient Management",
      icon: Users,
      steps: 8,
      avgTime: "12 minutes",
      successRate: 94,
      difficulty: "Beginner",
      agents: ["Intake iQ", "Schedule iQ", "Remind iQ"]
    },
    {
      id: "appointment-management",
      name: "Appointment Lifecycle Management",
      description: "From booking to post-visit follow-up",
      category: "Scheduling",
      icon: Calendar,
      steps: 6,
      avgTime: "8 minutes",
      successRate: 98,
      difficulty: "Beginner",
      agents: ["Schedule iQ", "Remind iQ", "Scribe iQ"]
    },
    {
      id: "insurance-verification",
      name: "Insurance Verification Process",
      description: "Automated insurance eligibility and benefits verification",
      category: "Insurance",
      icon: FileText,
      steps: 5,
      avgTime: "6 minutes",
      successRate: 91,
      difficulty: "Intermediate",
      agents: ["Claims iQ", "Intake iQ"]
    },
    {
      id: "billing-collections",
      name: "Billing & Collections",
      description: "Invoice generation and payment processing workflow",
      category: "Financial",
      icon: CreditCard,
      steps: 7,
      avgTime: "10 minutes",
      successRate: 89,
      difficulty: "Advanced",
      agents: ["Billing iQ", "Claims iQ", "Remind iQ"]
    },
    {
      id: "follow-up-care",
      name: "Post-Visit Follow-up",
      description: "Automated patient care reminders and check-ins",
      category: "Patient Care",
      icon: Heart,
      steps: 4,
      avgTime: "5 minutes",
      successRate: 96,
      difficulty: "Beginner",
      agents: ["Remind iQ", "Assist iQ"]
    },
    {
      id: "emergency-response",
      name: "Emergency Response Protocol",
      description: "Urgent patient communication and escalation",
      category: "Emergency",
      icon: Phone,
      steps: 3,
      avgTime: "2 minutes",
      successRate: 99,
      difficulty: "Advanced",
      agents: ["Assist iQ", "Remind iQ"]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Patient Management": "bg-blue-100 text-blue-800",
      "Scheduling": "bg-purple-100 text-purple-800", 
      "Insurance": "bg-indigo-100 text-indigo-800",
      "Financial": "bg-green-100 text-green-800",
      "Patient Care": "bg-pink-100 text-pink-800",
      "Emergency": "bg-red-100 text-red-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Workflow Templates</h2>
        <p className="text-muted-foreground">Choose from pre-built workflows to get started quickly</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => {
          const IconComponent = template.icon;
          return (
            <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-all duration-200 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <IconComponent className="w-4 h-4 text-purple-600" />
                    </div>
                    <Badge variant="outline" className={getCategoryColor(template.category)}>
                      {template.category}
                    </Badge>
                  </div>
                  <Badge variant="outline" className={getDifficultyColor(template.difficulty)}>
                    {template.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                  {template.name}
                </CardTitle>
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Steps:</span>
                    <div className="font-medium">{template.steps}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <div className="font-medium">{template.avgTime}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Success Rate:</span>
                    <div className="font-medium text-green-600">{template.successRate}%</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Agents:</span>
                    <div className="font-medium">{template.agents.length}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Required Agents:</div>
                  <div className="flex flex-wrap gap-1">
                    {template.agents.map((agent) => (
                      <Badge key={agent} variant="secondary" className="text-xs">
                        {agent}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    className="flex-1" 
                    onClick={() => onUseTemplate(template)}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Use Template
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
