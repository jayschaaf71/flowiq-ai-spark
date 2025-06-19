import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Calendar, 
  ClipboardList, 
  Bell, 
  CreditCard, 
  Receipt, 
  MessageSquare, 
  Stethoscope,
  Settings,
  Activity,
  Pause,
  Play
} from "lucide-react";

export const AgentOverview = () => {
  const agents = [
    {
      id: "schedule-iq",
      name: "Schedule iQ",
      icon: Calendar,
      status: "active",
      health: 98,
      tasksToday: 24,
      description: "Managing appointments and calendar optimization",
      lastAction: "Scheduled appointment for John Doe",
      actionTime: "2 minutes ago"
    },
    {
      id: "intake-iq",
      name: "Intake iQ",
      icon: ClipboardList,
      status: "active",
      health: 95,
      tasksToday: 18,
      description: "Processing patient intake forms and registration",
      lastAction: "Processed intake form for Sarah Wilson",
      actionTime: "5 minutes ago"
    },
    {
      id: "remind-iq",
      name: "Reminders iQ",
      icon: Bell,
      status: "active",
      health: 100,
      tasksToday: 45,
      description: "Sending automated reminders and follow-ups",
      lastAction: "Sent appointment reminder to 15 patients",
      actionTime: "1 hour ago"
    },
    {
      id: "billing-iq",
      name: "Billing iQ",
      icon: CreditCard,
      status: "maintenance",
      health: 0,
      tasksToday: 0,
      description: "Processing billing and insurance verification",
      lastAction: "System maintenance in progress",
      actionTime: "3 hours ago"
    },
    {
      id: "claims-iq",
      name: "Claims iQ",
      icon: Receipt,
      status: "active",
      health: 92,
      tasksToday: 12,
      description: "Automated insurance claims processing",
      lastAction: "Submitted 5 claims to BlueCross",
      actionTime: "30 minutes ago"
    },
    {
      id: "assist-iq",
      name: "Assist iQ",
      icon: MessageSquare,
      status: "active",
      health: 97,
      tasksToday: 31,
      description: "AI assistant for staff support and queries",
      lastAction: "Answered policy question for Dr. Smith",
      actionTime: "10 minutes ago"
    },
    {
      id: "scribe-iq",
      name: "Scribe iQ",
      icon: Stethoscope,
      status: "paused",
      health: 85,
      tasksToday: 0,
      description: "Medical transcription and documentation",
      lastAction: "Paused by user",
      actionTime: "1 day ago"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "paused": return "bg-yellow-100 text-yellow-800";
      case "maintenance": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 95) return "text-green-600";
    if (health >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">AI Agent Status</h3>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Configure All
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {agents.map((agent) => {
          const IconComponent = agent.icon;
          return (
            <Card key={agent.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <IconComponent className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{agent.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {agent.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Switch 
                    checked={agent.status === "active"} 
                    disabled={agent.status === "maintenance"}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(agent.status)}>
                    {agent.status}
                  </Badge>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getHealthColor(agent.health)}`}>
                      Health: {agent.health}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {agent.tasksToday} tasks today
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="text-sm text-muted-foreground">Last Action:</div>
                  <div className="text-sm font-medium">{agent.lastAction}</div>
                  <div className="text-xs text-muted-foreground">{agent.actionTime}</div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Activity className="w-4 h-4 mr-2" />
                    Monitor
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    disabled={agent.status === "maintenance"}
                  >
                    {agent.status === "paused" ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </>
                    )}
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
