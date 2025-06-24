
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock, AlertCircle } from "lucide-react";

export const DevelopmentRoadmap = () => {
  const claimsIQTasks = [
    { id: 1, title: "Fix Sample Data Creation", status: "in-progress", priority: "high", description: "Resolve team_members role constraint issue" },
    { id: 2, title: "Real-time Claims Processing", status: "done", priority: "medium", description: "WebSocket integration for live updates" },
    { id: 3, title: "AI Claims Review Engine", status: "todo", priority: "high", description: "Implement AI-powered claim validation" },
    { id: 4, title: "Denial Management Automation", status: "done", priority: "medium", description: "Auto-correction and appeal generation" },
    { id: 5, title: "Revenue Analytics Dashboard", status: "done", priority: "low", description: "Comprehensive financial reporting" },
    { id: 6, title: "Payer Integration APIs", status: "todo", priority: "high", description: "Direct submission to insurance providers" },
    { id: 7, title: "Compliance Monitoring", status: "todo", priority: "medium", description: "HIPAA and billing compliance checks" }
  ];

  const scribeIQTasks = [
    { id: 1, title: "SOAP Notes Database Schema", status: "todo", priority: "high", description: "Create tables for storing SOAP notes" },
    { id: 2, title: "Voice-to-Text Integration", status: "todo", priority: "high", description: "Real-time speech recognition for dictation" },
    { id: 3, title: "AI SOAP Generation", status: "todo", priority: "high", description: "Auto-generate SOAP notes from conversation" },
    { id: 4, title: "Template Management", status: "done", priority: "medium", description: "Specialty-specific note templates" },
    { id: 5, title: "Digital Signatures", status: "todo", priority: "medium", description: "Electronic signature capture and validation" },
    { id: 6, title: "Appointment Integration", status: "todo", priority: "low", description: "Link notes to specific appointments" },
    { id: 7, title: "Search and Filtering", status: "todo", priority: "low", description: "Advanced search across patient notes" }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'todo': return <Circle className="w-4 h-4 text-gray-400" />;
      default: return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "destructive",
      medium: "secondary",
      low: "outline"
    } as const;
    
    return <Badge variant={variants[priority as keyof typeof variants]}>{priority}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <h2 className="text-2xl font-bold mb-2">Development Roadmap</h2>
        <p className="text-muted-foreground">Current status and next steps for Scribe IQ and Claims IQ</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Claims IQ Roadmap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Claims IQ Development
            </CardTitle>
            <CardDescription>
              AI-powered claims processing and revenue cycle management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {claimsIQTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  {getStatusIcon(task.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      {getPriorityBadge(task.priority)}
                    </div>
                    <p className="text-xs text-muted-foreground">{task.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scribe IQ Roadmap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-purple-600" />
              Scribe IQ Development
            </CardTitle>
            <CardDescription>
              AI-powered clinical documentation and SOAP note generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scribeIQTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  {getStatusIcon(task.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      {getPriorityBadge(task.priority)}
                    </div>
                    <p className="text-xs text-muted-foreground">{task.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Immediate Next Steps</CardTitle>
          <CardDescription>Priority tasks to get both systems functional</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">🚨 Critical - Claims IQ</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Fix sample data creation (role constraint)</li>
                  <li>• Implement AI claims validation</li>
                  <li>• Add payer integration APIs</li>
                </ul>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">🚨 Critical - Scribe IQ</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Create SOAP notes database schema</li>
                  <li>• Implement voice-to-text functionality</li>
                  <li>• Build AI SOAP generation engine</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
