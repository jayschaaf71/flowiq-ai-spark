
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Mail, Clock, Calendar, Send, X } from "lucide-react";
import { format, isToday, isTomorrow, isPast } from "date-fns";

interface Message {
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
  message: Message;
  onSendNow: (messageId: string) => void;
  onCancel: (messageId: string) => void;
  isLoading?: boolean;
}

export const MessageCard = ({ message, onSendNow, onCancel, isLoading }: MessageCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent": return "bg-green-100 text-green-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "failed": return "bg-red-100 text-red-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatScheduledTime = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (isTomorrow(date)) {
      return `Tomorrow at ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, yyyy \'at\' h:mm a');
    }
  };

  const scheduledDate = new Date(message.scheduledFor);
  const canSendNow = message.status === "scheduled";
  const canCancel = message.status === "scheduled" && !isPast(scheduledDate);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {message.type === "email" ? (
                <Mail className="w-4 h-4 text-blue-600" />
              ) : (
                <MessageSquare className="w-4 h-4 text-green-600" />
              )}
              <span className="font-medium">
                {message.recipientCount ? 
                  `${message.recipient} (${message.recipientCount} recipients)` : 
                  message.recipient
                }
              </span>
            </div>
            <Badge className={getStatusColor(message.status)}>
              {message.status}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            {formatScheduledTime(message.scheduledFor)}
          </div>
        </div>

        {message.subject && (
          <h4 className="font-medium text-gray-900 mb-2">{message.subject}</h4>
        )}

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {message.message}
        </p>

        {message.campaign && (
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">{message.campaign}</span>
          </div>
        )}

        {(canSendNow || canCancel) && (
          <div className="flex gap-2">
            {canSendNow && (
              <Button
                size="sm"
                onClick={() => onSendNow(message.id)}
                disabled={isLoading}
                className="flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                Send Now
              </Button>
            )}
            {canCancel && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onCancel(message.id)}
                disabled={isLoading}
                className="flex items-center gap-1 text-red-600 hover:text-red-700"
              >
                <X className="w-3 h-3" />
                Cancel
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
