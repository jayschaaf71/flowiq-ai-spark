import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Send, Edit, Plus } from "lucide-react";

export const DripCampaigns = () => {
  const campaigns = [
    {
      id: 1,
      name: "CPAP Onboarding Series",
      type: "Device-specific",
      status: "Active",
      enrolledPatients: 45,
      completionRate: 78,
      messages: 7,
      description: "7-day educational series for new CPAP users"
    },
    {
      id: 2,
      name: "Oral Appliance Care",
      type: "Device-specific", 
      status: "Active",
      enrolledPatients: 32,
      completionRate: 85,
      messages: 5,
      description: "5-message series on oral appliance maintenance"
    },
    {
      id: 3,
      name: "Compliance Boost",
      type: "Behavioral",
      status: "Draft",
      enrolledPatients: 0,
      completionRate: 0,
      messages: 4,
      description: "Targeted messages for low-compliance patients"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Device-Specific Drip Campaigns
              </CardTitle>
              <CardDescription>
                Automated educational sequences tailored to specific sleep therapy devices
              </CardDescription>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">{campaign.name}</h3>
                    <p className="text-sm text-gray-600">{campaign.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={campaign.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                      {campaign.status}
                    </Badge>
                    <Badge variant="outline">{campaign.type}</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Enrolled Patients</div>
                    <div className="font-semibold flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {campaign.enrolledPatients}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Messages</div>
                    <div className="font-semibold flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {campaign.messages}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Completion Rate</div>
                    <div className="font-semibold">{campaign.completionRate}%</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Send className="w-4 h-4 mr-1" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};