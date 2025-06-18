
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Edit, 
  Trash2, 
  MessageSquare, 
  Mail, 
  Phone,
  Search,
  Copy,
  Send
} from "lucide-react";

export const MessageTemplates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const templates = [
    {
      id: 1,
      name: "Appointment Reminder - 24hr",
      category: "appointment",
      type: "sms",
      subject: "",
      content: "Hi {patientName}, this is a reminder that you have an appointment tomorrow at {time} with Dr. {doctorName}. Reply CONFIRM to confirm or RESCHEDULE to reschedule.",
      variables: ["patientName", "time", "doctorName"],
      usageCount: 156
    },
    {
      id: 2,
      name: "Welcome New Patient",
      category: "onboarding",
      type: "email",
      subject: "Welcome to {practiceName}!",
      content: "Dear {patientName},\n\nWelcome to our practice! We're excited to provide you with excellent healthcare. Please complete your intake forms before your first visit on {appointmentDate}.\n\nBest regards,\n{practiceName} Team",
      variables: ["patientName", "practiceName", "appointmentDate"],
      usageCount: 89
    },
    {
      id: 3,
      name: "Follow-up Care Instructions",
      category: "followup",
      type: "sms",
      subject: "",
      content: "Hi {patientName}, please remember to take your medication as prescribed and schedule your follow-up appointment in {timeframe}. Call us at {phoneNumber} if you have questions.",
      variables: ["patientName", "timeframe", "phoneNumber"],
      usageCount: 203
    },
    {
      id: 4,
      name: "Insurance Verification Required",
      category: "insurance",
      type: "email",
      subject: "Insurance Verification Needed - {patientName}",
      content: "Dear {patientName},\n\nWe need to verify your insurance information before your upcoming appointment. Please call our office at {phoneNumber} or visit our patient portal to update your details.\n\nThank you,\n{practiceName}",
      variables: ["patientName", "phoneNumber", "practiceName"],
      usageCount: 67
    }
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "appointment", label: "Appointments" },
    { value: "onboarding", label: "Onboarding" },
    { value: "followup", label: "Follow-up" },
    { value: "insurance", label: "Insurance" },
    { value: "billing", label: "Billing" }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sms": return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case "email": return <Mail className="w-4 h-4 text-green-600" />;
      case "call": return <Phone className="w-4 h-4 text-purple-600" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "sms": return <Badge className="bg-blue-100 text-blue-700">SMS</Badge>;
      case "email": return <Badge className="bg-green-100 text-green-700">Email</Badge>;
      case "call": return <Badge className="bg-purple-100 text-purple-700">Call</Badge>;
      default: return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(template.type)}
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>Used {template.usageCount} times</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getTypeBadge(template.type)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {template.subject && (
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Subject:</Label>
                  <p className="text-sm text-gray-600 font-medium">{template.subject}</p>
                </div>
              )}
              
              <div className="space-y-1">
                <Label className="text-sm font-medium">Content:</Label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{template.content}</p>
                </div>
              </div>

              {template.variables.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Variables:</Label>
                  <div className="flex flex-wrap gap-2">
                    {template.variables.map((variable) => (
                      <Badge key={variable} variant="outline" className="text-xs">
                        {`{${variable}}`}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Copy className="w-4 h-4 mr-1" />
                  Duplicate
                </Button>
                <Button variant="outline" size="sm">
                  <Send className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No templates found matching your criteria.</p>
            <Button className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Create New Template
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
