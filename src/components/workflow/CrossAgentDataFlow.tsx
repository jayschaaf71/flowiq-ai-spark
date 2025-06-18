
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Database, Users, FileText, Activity } from "lucide-react";

interface PatientData {
  id: string;
  name: string;
  status: string;
  currentAgent: string;
  progress: number;
  timeline: Array<{
    agent: string;
    action: string;
    timestamp: Date;
    data: any;
  }>;
}

export const CrossAgentDataFlow = () => {
  const [patients] = useState<PatientData[]>([
    {
      id: "p1",
      name: "Sarah Johnson",
      status: "In Progress",
      currentAgent: "Intake iQ",
      progress: 60,
      timeline: [
        {
          agent: "Assist iQ",
          action: "Initial Contact",
          timestamp: new Date(Date.now() - 3600000),
          data: { phone: "+1234567890", preferredTime: "morning" }
        },
        {
          agent: "Intake iQ", 
          action: "Form Submission",
          timestamp: new Date(Date.now() - 1800000),
          data: { formCompletion: 75, insuranceVerified: false }
        }
      ]
    },
    {
      id: "p2", 
      name: "Michael Chen",
      status: "Scheduled",
      currentAgent: "Schedule iQ",
      progress: 90,
      timeline: [
        {
          agent: "Assist iQ",
          action: "Initial Contact",
          timestamp: new Date(Date.now() - 7200000),
          data: { phone: "+1987654321", preferredTime: "afternoon" }
        },
        {
          agent: "Intake iQ",
          action: "Forms Completed", 
          timestamp: new Date(Date.now() - 5400000),
          data: { formCompletion: 100, insuranceVerified: true }
        },
        {
          agent: "Schedule iQ",
          action: "Appointment Booked",
          timestamp: new Date(Date.now() - 900000),
          data: { appointmentDate: "2024-06-20", time: "2:00 PM" }
        }
      ]
    }
  ]);

  const [sharedData] = useState({
    totalPatients: 156,
    activeWorkflows: 23,
    dataHandoffs: 45,
    averageCompletionTime: "8.5 hours"
  });

  const agentColors = {
    "Assist iQ": "bg-purple-100 text-purple-700",
    "Intake iQ": "bg-blue-100 text-blue-700", 
    "Schedule iQ": "bg-green-100 text-green-700",
    "Remind iQ": "bg-yellow-100 text-yellow-700",
    "Billing iQ": "bg-red-100 text-red-700",
    "Claims iQ": "bg-indigo-100 text-indigo-700",
    "Scribe iQ": "bg-pink-100 text-pink-700"
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sharedData.totalPatients}</div>
            <p className="text-xs text-muted-foreground">Across all workflows</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sharedData.activeWorkflows}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Handoffs</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sharedData.dataHandoffs}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Time</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sharedData.averageCompletionTime}</div>
            <p className="text-xs text-muted-foreground">End-to-end</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="patients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="patients">Patient Journey</TabsTrigger>
          <TabsTrigger value="dataflow">Data Flow</TabsTrigger>
          <TabsTrigger value="handoffs">Agent Handoffs</TabsTrigger>
        </TabsList>

        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Progress Tracking</CardTitle>
              <CardDescription>Real-time view of patient journey across agents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {patients.map((patient) => (
                <div key={patient.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{patient.name}</h4>
                      <p className="text-sm text-muted-foreground">Currently with {patient.currentAgent}</p>
                    </div>
                    <Badge variant={patient.status === "Scheduled" ? "default" : "secondary"}>
                      {patient.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{patient.progress}%</span>
                    </div>
                    <Progress value={patient.progress} />
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Agent Timeline</h5>
                    <div className="flex items-center gap-2 overflow-x-auto">
                      {patient.timeline.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 whitespace-nowrap">
                          <Badge variant="outline" className={agentColors[item.agent] || "bg-gray-100"}>
                            {item.agent}
                          </Badge>
                          {index < patient.timeline.length - 1 && (
                            <ArrowRight className="w-3 h-3 text-gray-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dataflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shared Data Repository</CardTitle>
              <CardDescription>Data structure shared across all agents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Patient Information</h4>
                  <div className="text-sm space-y-1">
                    <div>• Personal Details (Name, Contact, DOB)</div>
                    <div>• Insurance Information</div>
                    <div>• Medical History</div>
                    <div>• Preferences & Notes</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Workflow State</h4>
                  <div className="text-sm space-y-1">
                    <div>• Current Step & Agent</div>
                    <div>• Completion Status</div>
                    <div>• Form Submissions</div>
                    <div>• Communication History</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Appointment Data</h4>
                  <div className="text-sm space-y-1">
                    <div>• Scheduled Appointments</div>
                    <div>• Provider Assignments</div>
                    <div>• Visit Notes</div>
                    <div>• Follow-up Requirements</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Billing Information</h4>
                  <div className="text-sm space-y-1">
                    <div>• Insurance Claims</div>
                    <div>• Payment Status</div>
                    <div>• Outstanding Balances</div>
                    <div>• Billing Preferences</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="handoffs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Agent Handoffs</CardTitle>
              <CardDescription>Real-time view of task transfers between agents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    from: "Assist iQ",
                    to: "Intake iQ",
                    patient: "Sarah Johnson",
                    data: "Contact info & preferences",
                    time: "2 minutes ago"
                  },
                  {
                    from: "Intake iQ", 
                    to: "Schedule iQ",
                    patient: "Michael Chen",
                    data: "Completed forms & insurance verification",
                    time: "8 minutes ago"
                  },
                  {
                    from: "Schedule iQ",
                    to: "Remind iQ", 
                    patient: "Jennifer Davis",
                    data: "Appointment details",
                    time: "15 minutes ago"
                  }
                ].map((handoff, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={agentColors[handoff.from]}>
                        {handoff.from}
                      </Badge>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <Badge variant="outline" className={agentColors[handoff.to]}>
                        {handoff.to}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{handoff.patient}</div>
                      <div className="text-xs text-muted-foreground">{handoff.data}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{handoff.time}</div>
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
