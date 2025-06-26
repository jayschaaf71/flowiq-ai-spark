import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { MessageFilters } from "./scheduled/MessageFilters";
import { MessageStats } from "./scheduled/MessageStats";
import { MessageCard } from "./scheduled/MessageCard";

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

const defaultMessages: ScheduledMessage[] = [
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
];

export const ScheduledMessages = () => {
  const [filter, setFilter] = useState("all");
  const [messages, setMessages] = useState(defaultMessages);

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

  const filteredMessages = messages.filter(message => {
    if (filter === "all") return true;
    return message.status === filter;
  });

  const upcomingCount = messages.filter(m => m.status === "scheduled").length;
  const sentToday = messages.filter(m => 
    m.status === "sent" && 
    new Date(m.scheduledFor).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="space-y-6">
      <MessageFilters filter={filter} onFilterChange={setFilter} />

      <MessageStats 
        upcomingCount={upcomingCount}
        sentToday={sentToday}
        totalMessages={messages.length}
      />

      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <MessageCard
            key={message.id}
            message={message}
            onSendNow={sendNow}
            onCancel={cancelMessage}
          />
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
