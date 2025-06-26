
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Mail, 
  Send, 
  Pause, 
  Trash2,
  Calendar as CalendarIcon,
  Users
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

interface MessageCardProps {
  message: ScheduledMessage;
  onSendNow: (id: string) => void;
  onCancel: (id: string) => void;
}

export const MessageCard: React.FC<MessageCardProps> = ({
  message,
  onSendNow,
  onCancel
}) => {
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
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
                <Button variant="outline" size="sm" onClick={() => onSendNow(message.id)}>
                  <Send className="w-4 h-4 mr-1" />
                  Send Now
                </Button>
                <Button variant="outline" size="sm" onClick={() => onCancel(message.id)}>
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
  );
};
