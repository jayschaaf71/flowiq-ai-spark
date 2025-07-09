
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  MessageSquare, 
  Calendar, 
  Users, 
  FileText, 
  Zap,
  Plus,
  ArrowRight,
  Settings
} from "lucide-react";

export const DragDropWorkflowBuilder = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState("patient-onboarding");

  const workflowTemplates = {
    "patient-onboarding": {
      name: "AI-Powered Patient Onboarding",
      description: "Intelligent end-to-end patient registration with AI optimization",
      steps: [
        { id: 1, name: "Initial Contact", agent: "Intake iQ", ai: "Natural language processing for initial queries", duration: "2 min" },
        { id: 2, name: "Smart Form Generation", agent: "Intake iQ", ai: "Dynamic form creation based on patient needs", duration: "5 min" },
        { id: 3, name: "Document Processing", agent: "Scribe iQ", ai: "AI-powered document analysis and validation", duration: "3 min" },
        { id: 4, name: "Schedule Optimization", agent: "Appointment iQ", ai: "Predictive scheduling with provider matching", duration: "2 min" },
        { id: 5, name: "Automated Communications", agent: "Appointment iQ", ai: "Personalized welcome sequence", duration: "1 min" }
      ],
      aiFeatures: ["Predictive form fields", "Intelligent routing", "Auto-verification", "Risk assessment"]
    },
    "appointment-lifecycle": {
      name: "Autonomous Appointment Management",
      description: "Complete appointment lifecycle with AI decision-making",
      steps: [
        { id: 1, name: "Intelligent Booking", agent: "Appointment iQ", ai: "Natural language booking with conflict resolution", duration: "3 min" },
        { id: 2, name: "Pre-Visit Preparation", agent: "Intake iQ", ai: "Smart prep based on appointment type", duration: "5 min" },
        { id: 3, name: "Visit Documentation", agent: "Scribe iQ", ai: "Real-time AI scribe with clinical insights", duration: "15 min" },
        { id: 4, name: "Follow-up Automation", agent: "Appointment iQ", ai: "Personalized post-visit care plans", duration: "2 min" },
        { id: 5, name: "Billing Intelligence", agent: "Billing iQ", ai: "Auto-coding with accuracy optimization", duration: "1 min" }
      ],
      aiFeatures: ["Predictive no-show prevention", "Dynamic scheduling", "Clinical AI insights", "Revenue optimization"]
    }
  };

  const aiAgents = [
    { id: "appointment-iq", name: "Appointment iQ", icon: Calendar, color: "bg-blue-100 text-blue-700", ai: "Complete appointment lifecycle" },
    { id: "intake-iq", name: "Intake iQ", icon: Users, color: "bg-green-100 text-green-700", ai: "Intelligent patient onboarding" },
    { id: "scribe-iq", name: "Scribe iQ", icon: FileText, color: "bg-purple-100 text-purple-700", ai: "AI-powered documentation" },
    
  ];

  const currentWorkflow = workflowTemplates[selectedWorkflow];

  return (
    <div className="space-y-6">
      <Tabs value={selectedWorkflow} onValueChange={setSelectedWorkflow}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="patient-onboarding">Patient Onboarding</TabsTrigger>
          <TabsTrigger value="appointment-lifecycle">Appointment Lifecycle</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedWorkflow} className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    {currentWorkflow.name}
                  </CardTitle>
                  <p className="text-gray-600 mt-1">{currentWorkflow.description}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-purple-100 text-purple-700">
                    <Zap className="w-3 h-3 mr-1" />
                    AI-Native
                  </Badge>
                  <Button size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* AI Features Overview */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">AI-Native Features</h4>
                <div className="flex flex-wrap gap-2">
                  {currentWorkflow.aiFeatures.map((feature, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Workflow Steps */}
              <div className="space-y-4">
                <h4 className="font-medium">Intelligent Workflow Steps</h4>
                <div className="space-y-3">
                  {currentWorkflow.steps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-medium">
                        {step.id}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium">{step.name}</h5>
                          <Badge variant="outline" className="text-xs">
                            {step.duration}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{step.ai}</p>
                        <Badge className="bg-purple-100 text-purple-700 text-xs">
                          <Brain className="w-3 h-3 mr-1" />
                          {step.agent}
                        </Badge>
                      </div>

                      {index < currentWorkflow.steps.length - 1 && (
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Execution Controls */}
              <div className="flex gap-2 mt-6 pt-4 border-t">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Zap className="w-4 h-4 mr-2" />
                  Deploy AI Workflow
                </Button>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Test & Optimize
                </Button>
                <Button variant="outline">
                  <Brain className="w-4 h-4 mr-2" />
                  AI Training
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Available AI Agents */}
          <Card>
            <CardHeader>
              <CardTitle>Available AI Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {aiAgents.map((agent) => (
                  <div key={agent.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-2 rounded-lg ${agent.color}`}>
                        <agent.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{agent.name}</div>
                        <div className="text-xs text-gray-600">{agent.ai}</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full text-xs">
                      <Plus className="w-3 h-3 mr-1" />
                      Add to Workflow
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
