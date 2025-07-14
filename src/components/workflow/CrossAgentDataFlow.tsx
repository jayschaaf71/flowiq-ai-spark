
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Brain, 
  ArrowRight, 
  Database, 
  Zap, 
  Activity, 
  MessageSquare,
  Calendar,
  Users,
  FileText,
  TrendingUp
} from "lucide-react";

export const CrossAgentDataFlow = () => {
  const [selectedFlow, setSelectedFlow] = useState("voice-analytics");

  const dataFlows = {
    "voice-analytics": {
      name: "Voice Analytics Data Flow",
      description: "AI-powered voice call analysis and workflow automation",
      agents: [
        {
          name: "Voice iQ",
          icon: MessageSquare,
          color: "bg-indigo-100 text-indigo-700",
          input: "Voice call recordings, transcripts, caller data",
          processing: "Sentiment analysis, outcome detection, lead scoring",
          output: "Call outcomes, lead scores, follow-up recommendations",
          aiCapabilities: ["Voice transcription", "Sentiment analysis", "Lead qualification"]
        },
        {
          name: "Workflow Engine",
          icon: Zap,
          color: "bg-purple-100 text-purple-700",
          input: "Call outcomes, lead scores, trigger conditions",
          processing: "Automated workflow execution, decision routing, task creation",
          output: "Follow-up tasks, appointment bookings, automated communications",
          aiCapabilities: ["Workflow orchestration", "Decision automation", "Task optimization"]
        },
        {
          name: "Remind iQ",
          icon: MessageSquare,
          color: "bg-orange-100 text-orange-700",
          input: "Follow-up requirements, patient contact preferences",
          processing: "Personalized messaging, channel optimization, timing prediction",
          output: "Automated follow-ups, appointment reminders, nurture sequences",
          aiCapabilities: ["Message personalization", "Channel selection", "Timing optimization"]
        }
      ],
      dataElements: [
        { name: "Voice Recordings", sensitivity: "medium", encryption: true, aiProcessing: "Speech-to-text conversion" },
        { name: "Call Transcripts", sensitivity: "medium", encryption: true, aiProcessing: "Natural language processing" },
        { name: "Sentiment Scores", sensitivity: "low", encryption: false, aiProcessing: "Emotion detection" },
        { name: "Lead Qualification Data", sensitivity: "high", encryption: true, aiProcessing: "Predictive scoring" },
        { name: "Follow-up Actions", sensitivity: "medium", encryption: true, aiProcessing: "Workflow automation" }
      ]
    },
    "patient-onboarding": {
      name: "Patient Onboarding Data Flow",
      description: "AI-driven data flow through patient registration process",
      agents: [
        {
          name: "Intake iQ",
          icon: Users,
          color: "bg-blue-100 text-blue-700",
          input: "Patient contact info, insurance details",
          processing: "AI form generation, risk assessment, validation",
          output: "Structured patient profile, risk score, next steps",
          aiCapabilities: ["NLP processing", "Risk prediction", "Smart validation"]
        },
        {
          name: "Schedule iQ",
          icon: Calendar,
          color: "bg-green-100 text-green-700",
          input: "Patient profile, preferences, urgency level",
          processing: "Provider matching, optimal scheduling, conflict resolution",
          output: "Optimized appointment slots, provider assignments",
          aiCapabilities: ["Predictive scheduling", "Resource optimization", "Conflict resolution"]
        },
        {
          name: "Remind iQ",
          icon: MessageSquare,
          color: "bg-orange-100 text-orange-700",
          input: "Appointment details, patient preferences, contact info",
          processing: "Personalized messaging, channel optimization, timing prediction",
          output: "Automated welcome series, confirmation messages",
          aiCapabilities: ["Content personalization", "Channel selection", "Timing optimization"]
        }
      ],
      dataElements: [
        { name: "Patient Demographics", sensitivity: "high", encryption: true, aiProcessing: "Identity verification" },
        { name: "Medical History", sensitivity: "critical", encryption: true, aiProcessing: "Risk assessment" },
        { name: "Insurance Information", sensitivity: "medium", encryption: true, aiProcessing: "Coverage validation" },
        { name: "Scheduling Preferences", sensitivity: "low", encryption: false, aiProcessing: "Preference learning" },
        { name: "Communication Preferences", sensitivity: "low", encryption: false, aiProcessing: "Channel optimization" }
      ]
    },
    "appointment-management": {
      name: "Appointment Management Data Flow",
      description: "AI-orchestrated appointment lifecycle management",
      agents: [
        {
          name: "Schedule iQ",
          icon: Calendar,
          color: "bg-blue-100 text-blue-700",
          input: "Booking requests, provider schedules, patient history",
          processing: "Intelligent slot allocation, demand prediction, optimization",
          output: "Optimized schedules, booking confirmations, waitlist management",
          aiCapabilities: ["Demand forecasting", "Dynamic scheduling", "Resource optimization"]
        },
        {
          name: "Scribe iQ",
          icon: FileText,
          color: "bg-purple-100 text-purple-700",
          input: "Appointment notes, provider dictation, clinical data",
          processing: "Real-time transcription, clinical coding, summary generation",
          output: "Structured clinical notes, billing codes, follow-up tasks",
          aiCapabilities: ["Medical NLP", "Auto-coding", "Clinical insights"]
        },
        {
          name: "Billing iQ",
          icon: TrendingUp,
          color: "bg-green-100 text-green-700",
          input: "Clinical codes, insurance data, service details",
          processing: "Auto-billing, claim optimization, revenue analysis",
          output: "Optimized claims, revenue reports, payment processing",
          aiCapabilities: ["Claim optimization", "Revenue forecasting", "Denial prevention"]
        }
      ],
      dataElements: [
        { name: "Appointment Details", sensitivity: "medium", encryption: true, aiProcessing: "Schedule optimization" },
        { name: "Clinical Notes", sensitivity: "critical", encryption: true, aiProcessing: "Medical NLP" },
        { name: "Billing Codes", sensitivity: "medium", encryption: true, aiProcessing: "Auto-coding" },
        { name: "Payment Information", sensitivity: "high", encryption: true, aiProcessing: "Revenue optimization" },
        { name: "Provider Performance", sensitivity: "low", encryption: false, aiProcessing: "Efficiency analysis" }
      ]
    }
  };

  const currentFlow = dataFlows[selectedFlow];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            Cross-Agent Data Flow & AI Processing
          </h3>
          <p className="text-gray-600">Intelligent data flow orchestration across AI agents</p>
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={selectedFlow === "voice-analytics" ? "default" : "outline"}
            onClick={() => setSelectedFlow("voice-analytics")}
          >
            Voice Analytics
          </Button>
          <Button 
            size="sm" 
            variant={selectedFlow === "patient-onboarding" ? "default" : "outline"}
            onClick={() => setSelectedFlow("patient-onboarding")}
          >
            Patient Onboarding
          </Button>
          <Button 
            size="sm" 
            variant={selectedFlow === "appointment-management" ? "default" : "outline"}
            onClick={() => setSelectedFlow("appointment-management")}
          >
            Appointment Management
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            {currentFlow.name}
          </CardTitle>
          <p className="text-gray-600">{currentFlow.description}</p>
        </CardHeader>
        <CardContent>
          {/* Agent Flow Visualization */}
          <div className="space-y-6">
            <h4 className="font-medium">AI Agent Data Processing Chain</h4>
            <div className="space-y-4">
              {currentFlow.agents.map((agent, index) => (
                <div key={index}>
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className={`p-3 rounded-lg ${agent.color}`}>
                      <agent.icon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <h5 className="font-medium mb-2">{agent.name}</h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-gray-700 mb-1">Input Data</div>
                          <div className="text-gray-600">{agent.input}</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-700 mb-1">AI Processing</div>
                          <div className="text-gray-600">{agent.processing}</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-700 mb-1">Output Data</div>
                          <div className="text-gray-600">{agent.output}</div>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="font-medium text-gray-700 mb-1 text-sm">AI Capabilities</div>
                        <div className="flex flex-wrap gap-1">
                          {agent.aiCapabilities.map((capability, capIndex) => (
                            <Badge key={capIndex} variant="outline" className="text-xs bg-purple-50">
                              <Zap className="w-3 h-3 mr-1" />
                              {capability}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {index < currentFlow.agents.length - 1 && (
                    <div className="flex justify-center my-2">
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Data Elements & Security */}
          <div className="mt-8">
            <h4 className="font-medium mb-4">Data Elements & AI Processing</h4>
            <div className="space-y-2">
              {currentFlow.dataElements.map((element, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Database className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-medium text-sm">{element.name}</div>
                      <div className="text-xs text-gray-600">AI Processing: {element.aiProcessing}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        element.sensitivity === 'critical' ? 'bg-red-50 text-red-700' :
                        element.sensitivity === 'high' ? 'bg-orange-50 text-orange-700' :
                        element.sensitivity === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-green-50 text-green-700'
                      }`}
                    >
                      {element.sensitivity} sensitivity
                    </Badge>
                    {element.encryption && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                        Encrypted
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                      <Brain className="w-3 h-3 mr-1" />
                      AI Enhanced
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Optimization Metrics */}
          <div className="mt-8 p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-600" />
              AI Data Flow Optimization
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="font-medium text-purple-700">Processing Speed</div>
                <div className="text-purple-600">87% faster than traditional</div>
              </div>
              <div>
                <div className="font-medium text-purple-700">Data Accuracy</div>
                <div className="text-purple-600">94% AI validation rate</div>
              </div>
              <div>
                <div className="font-medium text-purple-700">Automation Level</div>
                <div className="text-purple-600">91% autonomous processing</div>
              </div>
              <div>
                <div className="font-medium text-purple-700">Error Reduction</div>
                <div className="text-purple-600">78% fewer manual errors</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
