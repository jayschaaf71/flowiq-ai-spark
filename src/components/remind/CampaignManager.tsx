
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Users, 
  Calendar,
  MessageSquare,
  Mail,
  BarChart3,
  Target
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  description: string;
  type: "sms" | "email" | "both";
  status: "active" | "paused" | "draft" | "completed";
  trigger: "appointment" | "followup" | "wellness" | "billing";
  timing: number; // hours before/after
  targetAudience: string;
  messageTemplate: string;
  sent: number;
  delivered: number;
  responded: number;
  createdAt: string;
}

export const CampaignManager = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      name: "Appointment Reminders - 24hr",
      description: "Automatic reminders sent 24 hours before appointments",
      type: "sms",
      status: "active",
      trigger: "appointment",
      timing: 24,
      targetAudience: "All patients with confirmed appointments",
      messageTemplate: "Hi {name}, this is a reminder of your appointment tomorrow at {time}.",
      sent: 1248,
      delivered: 1201,
      responded: 892,
      createdAt: "2024-01-10"
    },
    {
      id: "2",
      name: "Post-Visit Follow-up",
      description: "Follow-up care instructions and satisfaction survey",
      type: "email",
      status: "active",
      trigger: "followup",
      timing: 24,
      targetAudience: "Patients who completed visits",
      messageTemplate: "Thank you for your visit. Please follow these care instructions...",
      sent: 456,
      delivered: 445,
      responded: 234,
      createdAt: "2024-01-08"
    },
    {
      id: "3",
      name: "Wellness Check-ins",
      description: "Monthly wellness tips and health reminders",
      type: "email",
      status: "paused",
      trigger: "wellness",
      timing: 720, // 30 days
      targetAudience: "Patients with chronic conditions",
      messageTemplate: "It's time for your monthly wellness check-in...",
      sent: 234,
      delivered: 228,
      responded: 89,
      createdAt: "2024-01-05"
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    type: "sms" as const,
    trigger: "appointment" as const,
    timing: 24,
    targetAudience: "",
    messageTemplate: ""
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700";
      case "paused": return "bg-yellow-100 text-yellow-700";
      case "draft": return "bg-gray-100 text-gray-700";
      case "completed": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sms": return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case "email": return <Mail className="w-4 h-4 text-green-600" />;
      case "both": return <Target className="w-4 h-4 text-purple-600" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  const toggleCampaignStatus = (campaignId: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, status: campaign.status === "active" ? "paused" : "active" as const }
        : campaign
    ));
  };

  const createCampaign = () => {
    const campaign: Campaign = {
      id: Date.now().toString(),
      ...newCampaign,
      status: "draft",
      sent: 0,
      delivered: 0,
      responded: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setCampaigns(prev => [campaign, ...prev]);
    setNewCampaign({
      name: "",
      description: "",
      type: "sms",
      trigger: "appointment",
      timing: 24,
      targetAudience: "",
      messageTemplate: ""
    });
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Campaign Manager</h2>
          <p className="text-gray-600">Create and manage automated messaging campaigns</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Campaign</CardTitle>
            <CardDescription>Set up an automated messaging campaign</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter campaign name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Message Type</Label>
                <Select value={newCampaign.type} onValueChange={(value: any) => setNewCampaign(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="both">SMS + Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newCampaign.description}
                onChange={(e) => setNewCampaign(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe this campaign"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trigger">Trigger Event</Label>
                <Select value={newCampaign.trigger} onValueChange={(value: any) => setNewCampaign(prev => ({ ...prev, trigger: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appointment">Appointment</SelectItem>
                    <SelectItem value="followup">Follow-up</SelectItem>
                    <SelectItem value="wellness">Wellness</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timing">Timing (hours)</Label>
                <Input
                  id="timing"
                  type="number"
                  value={newCampaign.timing}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, timing: parseInt(e.target.value) }))}
                  placeholder="24"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Input
                id="audience"
                value={newCampaign.targetAudience}
                onChange={(e) => setNewCampaign(prev => ({ ...prev, targetAudience: e.target.value }))}
                placeholder="Describe the target audience"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message Template</Label>
              <Textarea
                id="message"
                value={newCampaign.messageTemplate}
                onChange={(e) => setNewCampaign(prev => ({ ...prev, messageTemplate: e.target.value }))}
                placeholder="Enter your message template with variables like {name}, {time}, {date}"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={createCampaign}>Create Campaign</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(campaign.type)}
                  <div>
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <CardDescription>{campaign.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleCampaignStatus(campaign.id)}
                  >
                    {campaign.status === "active" ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{campaign.sent}</div>
                  <div className="text-xs text-gray-600">Sent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{campaign.delivered}</div>
                  <div className="text-xs text-gray-600">Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{campaign.responded}</div>
                  <div className="text-xs text-gray-600">Responded</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    {Math.round((campaign.responded / campaign.sent) * 100) || 0}%
                  </div>
                  <div className="text-xs text-gray-600">Response Rate</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Calendar className="w-4 h-4" />
                <span>Trigger: {campaign.trigger} ({campaign.timing}h timing)</span>
                <Users className="w-4 h-4 ml-4" />
                <span>{campaign.targetAudience}</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="text-sm font-medium mb-1">Message Template:</p>
                <p className="text-sm text-gray-700">{campaign.messageTemplate}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Analytics
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
