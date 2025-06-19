import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { 
  Clock, 
  MessageSquare, 
  Mail, 
  Send, 
  Pause, 
  Trash2,
  Calendar as CalendarIcon,
  Users,
  Filter
} from "lucide-react";

interface ScheduledMessage {
  id: string;
  type: "sms" | "email";
  recipient: string;
  recipientCount?: number;
  subject?: string;
  message: string;
  scheduledFor: string;
  status: "scheduled" | "sent" | "failed" | "cancelled";
  campaign?: string;
  createdAt: string;
}

export const ScheduledMessages = () => {
  const [filter, setFilter] = useState("all");
  const [messages, setMessages] = useState<ScheduledMessage[]>([
    {
      id: "1",
      type: "sms",
      recipient: "John Smith",
      message: "Hi John, this is a reminder of your appointment tomorrow at 2:00 PM with Dr. Johnson.",
      scheduledFor: "2024-01-16T13:00:00",
      status: "scheduled",
      campaign: "24hr Appointment Reminders",
      createdAt: "2024-01-15T10:30:00"
    },
    {
      id: "2",
      type: "email",
      recipient: "Wellness Group",
      recipientCount: 156,
      subject: "Monthly Wellness Newsletter",
      message: "Dear patients, here are your personalized wellness tips for this month...",
      scheduledFor: "2024-01-20T09:00:00",
      status: "scheduled",
      campaign: "Wellness Check-ins",
      createdAt: "2024-01-15T14:20:00"
    },
    {
      id: "3",
      type: "sms",
      recipient: "Sarah Wilson",
      message: "Your lab results are ready. Please call our office to schedule a follow-up appointment.",
      scheduledFor: "2024-01-15T16:00:00",
      status: "sent",
      createdAt: "2024-01-15T08:15:00"
    },
    {
      id: "4",
      type: "email",
      recipient: "Mike Davis",
      subject: "Insurance Verification Required",
      message: "We need to verify your insurance information before your upcoming appointment...",
      scheduledFor: "2024-01-17T10:00:00",
      status: "scheduled",
      createdAt: "2024-01-15T11:45:00"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-700";
      case "sent": return "bg-green-100 text-green-700";
      case "failed": return "bg-red-100 text-red-700";
      case "cancelled": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sms": return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case "email": return <Mail className="w-4 h-4 text-green-600" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredMessages = messages.filter(message => {
    if (filter === "all") return true;
    return message.status === filter;
  });

  const cancelMessage = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, status: "cancelled" as const }
        : msg
    ));
  };

  const sendNow = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, status: "sent" as const }
        : msg
    ));
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const upcomingCount = messages.filter(m => m.status === "scheduled").length;
  const sentToday = messages.filter(m => 
    m.status === "sent" && 
    new Date(m.scheduledFor).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Scheduled Messages</h2>
          <p className="text-gray-600">Manage upcoming and sent messages</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Messages</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold text-blue-600">{upcomingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sent Today</p>
                <p className="text-2xl font-bold text-green-600">{sentToday}</p>
              </div>
              <Send className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold text-purple-600">{messages.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <Card key={message.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(message.type)}
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {message.recipient}
                      {message.recipientCount && (
                        <Badge variant="outline">
                          <Users className="w-3 h-3 mr-1" />
                          {message.recipientCount}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {message.subject && (
                        <span className="font-medium">{message.subject} • </span>
                      )}
                      Scheduled for {formatDateTime(message.scheduledFor)}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(message.status)}>
                    {message.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="text-sm">{message.message}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Created: {formatDateTime(message.createdAt)}</span>
                  </div>
                  {message.campaign && (
                    <div className="flex items-center gap-1">
                      <span>Campaign: {message.campaign}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {message.status === "scheduled" && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => sendNow(message.id)}>
                        <Send className="w-4 h-4 mr-1" />
                        Send Now
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => cancelMessage(message.id)}>
                        <Pause className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </>
                  )}
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No messages found for the selected filter.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
